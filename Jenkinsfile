pipeline {
  agent any

  tools {nodejs "Node"}

  stages {

    stage('Cloning Git') {
      steps {
        git ''
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Production') {
      steps {
         sh 'npm run production'
      }
    }

    stage('Deployment') {
          steps {
          }
     }
  }
}

