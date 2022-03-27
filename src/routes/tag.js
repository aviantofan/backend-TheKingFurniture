const tag = require("express").Router()

const tagController = require("../controllers/tag")

tag.get("/", tagController.getAllTag)
tag.post("/", tagController.createTag)
tag.patch("/:id", tagController.updateTag)
tag.get("/:id", tagController.userTag)
tag.delete("/:id", tagController.deleteTag)

module.exports = tag
