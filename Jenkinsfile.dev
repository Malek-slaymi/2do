pipeline {
  agent { label 'docker' }
  environment {
    APP_DIR = 'frontend'
    IMAGE_BASE = "myorg/frontend:dev"
  }
  triggers {
    // trigger on push to dev using Multibranch (no explicit trigger needed)
  }
  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Setup') {
      steps {
        dir(APP_DIR) {
          bat 'npm ci'
        }
      }
    }

    stage('Build') {
      parallel {
        "node-16": {
          steps {
            dir(APP_DIR) {
              bat 'node -v'
              bat 'npm run build'
              bat 'mkdir -p artifacts/node-16 && cp -r build artifacts/node-16/'
            }
          }
        }
        "node-18": {
          steps {
            dir(APP_DIR) {
              // using same host node; demonstrate parallel builds (if agents support containerization, better)
              bat 'node -v'
              bat 'npm run build'
              bat 'mkdir -p artifacts/node-18 && cp -r build artifacts/node-18/'
            }
          }
        }
      }
    }

    stage('Run (Docker)') {
      steps {
        dir(APP_DIR) {
          bat "docker build -t ${IMAGE_BASE}:${BUILD_NUMBER} ."
          bat "docker run -d --rm -p 8081:80 --name dev_run_${BUILD_ID} ${IMAGE_BASE}:${BUILD_NUMBER}"
          bat 'sleep 3'
        }
      }
    }

    stage('Smoke Test') {
      steps {
        dir(APP_DIR) {
          bat "./smoke-test.sh http://localhost:8081 20 || true"
          bat 'cat smoke-result.json || true'
        }
      }
    }

    stage('Archive Artifacts') {
      steps {
        archiveArtifacts artifacts: "${APP_DIR}/artifacts/**, ${APP_DIR}/smoke-result.json", fingerprint: true
      }
    }
  }

  post {
    always {
      bat "docker ps -a -q --filter name=dev_run_${BUILD_ID} | xargs -r docker rm -f || true"
      bat "docker rmi ${IMAGE_BASE}:${BUILD_NUMBER} || true"
    }
  }
}
