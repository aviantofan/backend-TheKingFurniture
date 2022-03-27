const Tag = require("../models/tag")

exports.getAllTag = async (req, res)=> {
    const results = await Tag.findAll()
    return res.send({
        success: true,
        message: "List All Tag",
        results
    })
}

exports.createTag = async(req, res)=>{
    try{
        const tag = await Tag.create(req.body)
        return res.send({
            success: true,
            message: "Tag created!",
            results: tag
        })
    }catch(e){
        return res.status(400).send({
            success: false,
            message: "Error",
            results: e.errors.map(err => ({field: err.path, message: err.message}))
        })
    }
}

exports.updateTag = async (req, res)=> {
    const {id} = req.params
    const tag = await Tag.findByPk(id)
    if(tag){
        for(let key in req.body){
            tag[key] = req.body[key]
        }
        await tag.save()
        return res.send({
            success: true,
            message: "Tag Updated!",
            results: tag
        })
    }else{
        return res.status(404).send({
            success: false,
            message: "Tag not found!"
        })
    }
}

exports.userTag = async(req, res)=> {
    const {id} = req.params
    const tag = await Tag.findByPk(id)
    if(tag){
        return res.send({
            success: true,
            message: "Tag Detail",
            results: tag
        })
    }else{
        return res.status(404).send({
            success: false,
            message: "Tag not found!"
        })
    }
}

exports.deleteTag = async(req, res)=> {
    const {id} = req.params
    const tag = await Tag.findByPk(id)
    if(tag){
        await tag.destroy()
        return res.send({
            success: true,
            message: "Tag Deleted!"
        })
    }else{
        return res.status(404).send({
            success: false,
            message: "Tag not found!"
        })
    }
}
