var app = server.express;

app.get('/', (req, res) => {
	res.sendfile('./client/index.html');
});
app.get('/app.js', (req, res) => {
	res.sendfile('./client/app.js');
});