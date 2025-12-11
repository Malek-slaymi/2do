pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Node Dependencies') {
            steps {
                bat 'node -v'
                bat 'npm install'
            }
        }

        stage('Build React App') {
            environment {
                CI = "false"
            }
            steps {
                bat 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t my_app .'
            }
        }

        stage('Run Docker Container') {
            steps {
                
                bat 'docker stop my_app_container || echo "no container to stop"'
                bat 'docker rm my_app_container || echo "no container to remove"'

               
                bat 'docker run -d -p 3000:80 --name my_app_container my_app'
            }
        }
    }

    post {
        always {
            bat 'echo "Pipeline Finished"'
        }
    }
}