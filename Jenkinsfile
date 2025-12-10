// Jenkinsfile Dispatcher pour Multibranch Pipeline
pipeline {
    agent any

    stages {
        stage('Determine pipeline type') {
            steps {
                script {
                    // Détecte le type de pipeline
                    if (env.CHANGE_ID) {
                        // Pull Request
                        echo "Detected PR: CHANGE_ID=${env.CHANGE_ID}"
                        pipelineFile = 'Jenkinsfile.pr'
                    } else if (env.BRANCH_NAME == 'dev') {
                        // Branch dev
                        echo "Detected dev branch"
                        pipelineFile = 'Jenkinsfile.dev'
                    } else if (env.BRANCH_NAME ==~ /^v\d+\.\d+\.\d+$/) {
                        // Tag versionné
                        echo "Detected tag ${env.BRANCH_NAME}"
                        pipelineFile = 'Jenkinsfile.tag'
                    } else {
                        // Fallback
                        echo "Fallback to dev pipeline for branch ${env.BRANCH_NAME}"
                        pipelineFile = 'Jenkinsfile.dev'
                    }

                    // Vérifie que le fichier existe
                    if (!fileExists(pipelineFile)) {
                        error("Dispatcher: ${pipelineFile} not found in repository.")
                    }

                    // Exécute le pipeline correspondant
                    evaluate(readFile(pipelineFile))
                }
            }
        }
    }
}
