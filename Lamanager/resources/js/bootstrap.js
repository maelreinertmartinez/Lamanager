import axios from 'axios';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found');
}

// Add auth token to requests if available
const authToken = localStorage.getItem('token');
if (authToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
}
