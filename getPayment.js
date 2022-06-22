// app.post('/Info', function (req, res) {

//     const body = req.body

//     taxee(body).then(function(payment){
//         res.send(payment)
//     }).catch(function (error) {
//         res.render('error')
//     })

// })

// function taxee(body) {
//     return new Promise((resolve, reject) => {

        
//         axios.post('https://taxee.io/api/v2/calculate/2017', body, {
//             //data sent to Taxee.io
//             headers: {
//                 'Content-Type': 'application/json',
//                 // eslint-disable-next-line no-undef
//                 Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
//             }
            
//         }).then(function (response) {
//             // var taxData = {
//             //     income: '$' + income
//             //     , fica: response.data.annual.fica.amount
//             //     , federal: response.data.annual.federal.amount
//             //     , stateTax: response.data.annual.state.amount
//             //     , state
//             //     , zip: zip
//             // }
//             resolve(response.data)
//         }).catch(function (error) {
//             console.log('break')
//             resolve(error)
//         })
//     })
// }