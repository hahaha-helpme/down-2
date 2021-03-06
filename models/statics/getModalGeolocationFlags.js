module.exports = function(schema, schemaBaseReferences, schemaAdditionalReferences) {
  schema.static('getModalGeolocationFlags', function(req, res) {

    const {
      languageCode,
      countryCode,
      nameHyphen,
      cityName
    } = schemaBaseReferences

    const {
      countryFlagImg,
      countryFlagAlt,
      languageEndonym
    } = schemaAdditionalReferences

    const {
      reqLanguageCode,
      reqCountryCode,
      reqServiceName
    } = res.locals

    const query = {
      [cityName]: null,
      [nameHyphen]: reqServiceName,
      $and: [
        {[languageCode]: {$ne: reqLanguageCode}}, 
        {[countryCode]: {$ne: reqCountryCode}}
      ]
    }

    const projection = {
      _id: 0,
      link: undefined,
      anchor: `$${languageEndonym}`,
      img: `$${countryFlagImg}`,
      alt: `$${countryFlagAlt}`
    }

    if (reqServiceName) {
      projection.link = {
        $concat: ['/', `$${languageCode}`, '-', `$${countryCode}`, '/', `$${nameHyphen}`]
      }
    } else {
      projection.link = {
        $concat: ['/', `$${languageCode}`, '-', `$${countryCode}`]
      }
    }

    return this.aggregate([
      {$match: query},
      {$project: projection}
    ])
  })
}