const apiKey = 'N/KUHW09nFB2eUiouQbirC8Dy2xQM9Je'; // Replace with your actual API key
const url = 'https://marsapi.ams.usda.gov/services/v1.1/reports';

fetch(url, {
  method: 'GET',
  headers: {
    'x-api-key': apiKey
  }
})
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
})
.then(data => {
  console.log(data); // Process the retrieved data
})
.catch(error => {
  console.error('Error fetching data:', error);
});
