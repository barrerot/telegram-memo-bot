const axios = require('axios');
const { memosUrl, memosToken } = require('../config/config');

const sendMemo = async (content, tags = []) => {
  const data = {
    content: content,
    tags: tags
  };

  console.log('Payload enviado:', JSON.stringify(data, null, 2));

  try {
    const response = await axios.post(memosUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${memosToken}`
      }
    });
    console.log('Nota creada exitosamente:');
    console.log(JSON.stringify(response.data, null, 2));
    return 'Nota creada exitosamente.';
  } catch (error) {
    if (error.response) {
      console.error('Error en la respuesta del servidor:', error.response.data);
      return `Error en la respuesta del servidor: ${JSON.stringify(error.response.data)}`;
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor:', error.request);
      return 'No se recibió respuesta del servidor.';
    } else {
      console.error('Error al configurar la solicitud:', error.message);
      return `Error al configurar la solicitud: ${error.message}`;
    }
  }
};

module.exports = {
  sendMemo
};
