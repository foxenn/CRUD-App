if(process.env.NODE_ENV === 'production'){
	module.exports = {mongoURI: 'mongodb://nikhil:nikhil@ds113636.mlab.com:13636/vidjot-prod'}
} else{
	module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}