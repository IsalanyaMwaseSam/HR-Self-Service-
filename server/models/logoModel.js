let logoURL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB8MmQ6r38keqBTFYIWOTwhh0H8kvu6JBRxw&s'; 

class Logo {
  static getLogoURL() {
    return logoURL;
  }

  static setLogoURL(newURL) {
    logoURL = newURL;
  }
}

module.exports = Logo;
