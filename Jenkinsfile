// Jenkinsfile dispatcher
node {
  stage('Determine pipeline type') {
    def scriptFile = null
    if (env.CHANGE_ID) {
      scriptFile = 'Jenkinsfile.pr'
      echo "Detected PR: CHANGE_ID=${env.CHANGE_ID}"
    } else if (env.BRANCH_NAME == 'dev') {
      scriptFile = 'Jenkinsfile.dev'
      echo "Detected dev branch"
    } else if (env.BRANCH_NAME ==~ /^v\d+\.\d+\.\d+$/) {
      scriptFile = 'Jenkinsfile.tag'
      echo "Detected tag ${env.BRANCH_NAME}"
    } else {
      // fallback: default to dev or stop
      scriptFile = 'Jenkinsfile.dev'
      echo "Fallback to dev pipeline for branch ${env.BRANCH_NAME}"
    }

    if (!fileExists(scriptFile)) {
      error("Dispatcher: ${scriptFile} not found in repository. Add it or change dispatcher logic.")
    }

    def pipelineScript = readFile(scriptFile)
    evaluate(pipelineScript) // exécute le contenu du Jenkinsfile choisi
  }
}
