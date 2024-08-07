let illustrationURL = 'https://aixeo.fr/wp-content/uploads/2022/10/equipe-commerciale-discutant-idees-demarrage_74855-4380.jpeg'

class Illustration {
    static getillustrationURL() {
      return illustrationURL;
    }
  
    static setillustrationURL(newillustrationURL) {
      illustrationURL = newillustrationURL;
    }
  }
  
  module.exports = Illustration;