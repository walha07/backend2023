const express = require('express');
const router = express.Router();
const Scategorie=require("../models/scategorie")
// afficher la liste des scategories.
router.get('/', async (req, res, )=> {
    try {
    const scat = await Scategorie.find();
    
    res.status(200).json(scat);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    
    });
    // créer un nouvelle scatégorie
router.post('/', async (req, res) => {
    const { nomscategorie, imagescat,categorieID} = req.body;
    const newScategorie = new Scategorie({nomscategorie:nomscategorie,
    imagescat:imagescat,categorieID:categorieID})
    
    try {
    await newScategorie.save();
    
    res.status(200).json(newScategorie );
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    
    });
    // chercher une scatégorie
router.get('/:scategorieId',async(req, res)=>{
    try {
    const scat = await Scategorie.findById(req.params.scategorieId);
    res.status(200).json(scat);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });
    // modifier une scatégorie
router.put('/:scategorieId', async (req, res)=> {
    const { nomscategorie, imagescategorie,categorieID} = req.body;
    const id = req.params.scategorieId;
    try {
    const scat1 = {
    nomscategorie:nomscategorie,imagescat:imagescat,categorieID:categorieID, _id:id };
    await Scategorie.findByIdAndUpdate(id, scat1);
    res.json(scat1);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });
    // Supprimer une scatégorie
router.delete('/:scategorieId', async (req, res)=> {
    const id = req.params.scategorieId;
    await Scategorie.findByIdAndDelete(id);
    
    res.json({ message: "scategorie deleted successfully." });
    });
    module.exports = router;