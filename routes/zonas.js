const getall = async (firestore, req, res)=>{
    const snapshot = await firestore.collection('zonas').get()
    try{
        const docs = snapshot.docs.map(doc =>{
            return {
                id: doc.id, 
                nombre: doc.data().nombre
            }
        })
        res.send({
            error: false, 
            data: docs
        })
    }catch(err){
        res.send({
            error: true, 
            message: error.message
        })
    }
}

const getone = async (firestore, req, res) => {
    const collectionref = await firestore.collection('zonas')
    try {
        const docref = await collectionref.doc(req.params.id)
        const snapshot = await docref.get()

        if (snapshot.exists) {
            var parroquias = await firestore.collection('decanatos').where('zona', '==', snapshot.id);
            var snapParroquias = await parroquias.get();
            var decanatos = []
            var parroquias = []
            snapParroquias.forEach(doc => {
                var d = doc.data();
                decanatos.push({
                    id: doc.id,
                    nombre: d.nombre
                });
            });

            res.send({
                error: false,
                data: {
                    id: snapshot.id,
                    ...snapshot.data(),
                    decanatos
                }
            })
        } else {
            res.send({
                error: true,
                message: 'no existe zona con ese id'
            })
        }
    } catch (err) {
        res.send({
            error: true,
            message: err.message
        })
    }
}

// -----------------------------------
// Comentado, ya que las zonas son fijas
// -----------------------------------

// const add = async (firebase, req, res)=>{
//     const nuevaZona = {
//         nombre: req.body.nombre, 
//         decanatos: req.body.decanatos
//     }

//     //validate decanatos
//     nuevaZona.decanatos.foreach(decanato => {
//         const decanatoref = await firestore.collection('decanatos').doc(decanato)
//         const snapshot = await decanatoref.get()
//         if (!snapshot.exists) {
//             return res.send({
//                 error: true,
//                 message: 'one of the decanatos ID does not exist'
//             })
//         }
//     });

//     const collrectionref = await firebase.collection('zonas')
//     try {
//         const docref = await collrectionref.add(nuevaZona)
//         res.send({
//             error: false, 
//             id: docref.id
//         })
//     }catch(err){
//         res.send({
//             error: true, 
//             message: err.message
//         })
//     }
// }

module.exports = {
    // add,
    getall, 
    getone
}
