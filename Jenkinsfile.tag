pipeline {
  agent { label 'docker' }
  environment {
    APP_DIR = 'frontend'
  }
  triggers {
    // Multibranch should detect tags and run this Jenkinsfile if branch is a tag
  }
  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Setup') {
      steps {
        dir(APP_DIR) { sh 'npm ci' }
      }
    }

    stage('Build') {
      steps {
        dir(APP_DIR) { sh 'npm run build' }
      }
    }

    stage('Run (Docker)') {
      steps {
        dir(APP_DIR) {
          script {
            def tag = env.GIT_TAG ?: env.BRANCH_NAME // Jenkins may expose tag in BRANCH_NAME e.g. refs/tags/v1.0.0
            def image = "myorg/frontend:${tag}"
            bat "docker build -t ${image} ."
            bat "docker save ${image} -o ${WORKSPACE}/artifact-image-${tag}.tar"
          }
        }
      }
    }

    stage('Smoke Test') {
      steps {
        dir(APP_DIR) {
          // can load the image locally and run
          bat "docker load -i ${WORKSPACE}/artifact-image-${env.BRANCH_NAME}.tar || true"
          bat "docker run -d --rm -p 8090:80 --name tag_run_${BUILD_ID} myorg/frontend:${env.BRANCH_NAME}"
          bat 'sleep 3'
          bat "./smoke-test.sh http://localhost:8090 20 || true"
          bat 'cat smoke-result.json || true'
        }
      }
    }

    stage('Archive Artifacts') {
      steps {
        archiveArtifacts artifacts: "${APP_DIR}/build/**, ${WORKSPACE}/artifact-image-*.tar, ${APP_DIR}/smoke-result.json", fingerprint: true
      }
    }
  }
  post {
    always {
      bat "docker ps -a -q --filter name=tag_run_${BUILD_ID} | xargs -r docker rm -f || true"
      // push image to registry if desired (requires credentials)
      // withCredentials(...) { sh "docker login ... && docker push myorg/frontend:${env.BRANCH_NAME}" }
    }
  }
}
