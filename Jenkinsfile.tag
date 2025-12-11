pipeline {
  agent any
  environment {
    CONTAINER_PORT = "3000"
  }

  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Determine Version') {
      steps {
        script {
          if (isUnix()) {
            VERSION = sh(script: "git describe --tags --always", returnStdout: true).trim()
          } else {
            VERSION = bat(script: "git describe --tags --always", returnStdout: true).trim()
          }
          echo "Version = ${VERSION}"
        }
      }
    }

    stage('Install') {
      steps { script { if (isUnix()) { sh 'npm ci' } else { bat 'npm ci' } } }
    }

    stage('Build') {
      steps { script { if (isUnix()) { sh 'npm run build' } else { bat 'npm run build' } } }
    }

    stage('Docker Build') {
      steps {
        script {
          def image = "react-app:${VERSION}"
          if (isUnix()) { sh "docker build -t ${image} ." } else { bat "docker build -t ${image} ." }
          env.IMAGE_TAG = image
        }
      }
    }

    stage('Run Container') {
      steps {
        script {
          def image = env.IMAGE_TAG
          if (isUnix()) { sh "docker run -d --name tag_test -p ${CONTAINER_PORT}:80 ${image}" } else { bat "docker run -d --name tag_test -p ${CONTAINER_PORT}:80 ${image}" }
        }
      }
    }

    stage('Smoke Test') {
      steps {
        script {
          def host = "http://localhost:${CONTAINER_PORT}"
          def ok = false
          for (int i=0;i<30;i++) {
            try {
              if (isUnix()) {
                def code = sh(script: "curl -s -o /dev/null -w '%{http_code}' ${host}", returnStdout: true).trim()
                if (code == '200') { ok = true; break }
              } else {
                def ps = bat(returnStdout: true, script: "powershell -Command \"(Invoke-WebRequest -UseBasicParsing -Uri '${host}').StatusCode\"").trim()
                if (ps == '200') { ok = true; break }
              }
            } catch (err) { echo "Waiting for app... ${err}" }
            sleep 2
          }
          if (!ok) { error("Smoke failed for ${host}") } else { echo "Smoke passed" }
        }
      }
    }

    stage('Archive Versioned Build') {
      steps {
        script {
          def v = env.IMAGE_TAG ?: "unknown"
          if (isUnix()) {
            sh "tar czf build-${v}.tar.gz dist || true"
          } else {
            bat "powershell -Command \"Compress-Archive -Path dist\\* -DestinationPath build-${v}.zip -Force\""
          }
          archiveArtifacts artifacts: isUnix() ? "build-${v}.tar.gz" : "build-${v}.zip", fingerprint: true
        }
      }
    }
  }

  post {
    always {
      script {
        if (isUnix()) {
          sh "docker rm -f tag_test || true"
        } else {
          bat "docker rm -f tag_test || echo none"
        }
      }
    }
  }
}
