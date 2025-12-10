pipeline {
  agent any

  environment {
    VERSION = sh(script: "git describe --tags", returnStdout: true).trim()
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install') {
      steps { bat "npm ci" }
    }

    stage('Build') {
      steps { bat "npm run build" }
    }

    stage('Docker Build') {
      steps {
        bat "docker build -t react-app:${VERSION} ."
      }
    }

    stage('Run Container') {
      steps {
        bat "docker run -d --name tag_test -p 3000:80 react-app:${VERSION}"
      }
    }

    stage('Smoke Test') {
      steps { bat "./smoke.sh http://localhost:3000" }
    }

    stage('Archive Versioned Build') {
      steps {
        bat "tar -czf build-${VERSION}.tar.gz build/"
        archiveArtifacts artifacts: "build-${VERSION}.tar.gz"
      }
    }
  }

  post {
    always {
      bat "docker rm -f tag_test || true"
    }
  }
}
