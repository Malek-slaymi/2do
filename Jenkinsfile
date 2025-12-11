// Dispatcher Jenkinsfile - chooses pipeline file based on item type
pipeline {
  agent any
  stages {
    stage('Determine pipeline type') {
      steps {
        script {
          def pipelineFile
          if (env.CHANGE_ID) {
            echo "Detected PR: CHANGE_ID=${env.CHANGE_ID}"
            pipelineFile = 'Jenkinsfile.pr'
          } else if (env.BRANCH_NAME == 'dev') {
            echo "Detected dev branch"
            pipelineFile = 'Jenkinsfile.dev'
          } else if (env.BRANCH_NAME ==~ /^v\d+\.\d+\.\d+$/) {
            echo "Detected tag ${env.BRANCH_NAME}"
            pipelineFile = 'Jenkinsfile.tag'
          } else {
            echo "Fallback to dev pipeline for branch ${env.BRANCH_NAME}"
            pipelineFile = 'Jenkinsfile.dev'
          }

          if (!fileExists(pipelineFile)) {
            error("Dispatcher: ${pipelineFile} not found in repository. Add it or change dispatcher logic.")
          }
          // evaluate the selected Jenkinsfile content
          evaluate(readFile(pipelineFile))
        }
      }
    }
  }
}
