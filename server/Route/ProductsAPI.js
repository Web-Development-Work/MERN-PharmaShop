const Product = require('../models/Products')
const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess = require('../HandleFunction/handleSuccess')
const jwt = require("jsonwebtoken");
const fs = require('fs')
const mime = require('mime')
const mongoose = require('mongoose')
const uploadMult = require('../HandleFunction/UploadMulti')
const Categories = require('../models/Categories')
const webp = require('webp-converter');
webp.grant_permission();
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
const ObjectId = mongoose.mongo.ObjectId
//Add new Product
app.post('/api/addProduct', (req, res) => {
    uploadMult(req, res, function (err) {
        if (err) {
            return res.json(handleErr(err))
        }
        else {
            if (req.files !== undefined && req.body.title && req.body.category && req.body.subcategory
                && req.body.description && req.body.howToUse && req.body.brand && req.body.stock !== undefined
                && req.body.fakeCost !== undefined && req.body.actualCost !== undefined) {
                let fileData = req.files
                if (fileData.length > 0) {
                    let images = fileData.map((file) => {
                        var sourceFile = __dirname + '/../pharmashopfiles/' + file.filename;
                        var resultFile = __dirname + '/../pharmashopfiles/' + file.filename + '.webp';
                        const result = webp.cwebp(sourceFile, resultFile, "-q 80", logging = "-v");
                        result.then((resp) => {
                            console.log(resp);
                            return resultFile
                        });
                    })
                    let product = { title, category, subcategory, description, howToUse, brand, stock, fakeCost, actualCost } = req.body
                    product.images = images
                    Product.create(product, (err, doc) => {
                        if (err) return res.json(handleErr(err))
                        else {
                            Product.populate(doc, [{
                                path: 'category',
                                model: "categories"
                            }, {
                                path: 'brand',
                                model: "brands"
                            }
                            ], (error, finalProduct) => {
                                if (error) return res.json(handleErr(error))
                                else {
                                    let { subcategory, category } = finalProduct
                                    if (category !== null) {
                                        let { subcategories } = category
                                        let productSubcategory = subcategories.map((sub) => {
                                            return sub._id
                                        })
                                        let finalObj = Object.assign({}, finalProduct._doc)
                                        let finalSub = subcategories[productSubcategory.indexOf(subcategory)]
                                        finalObj.itemSubCategory = finalSub
                                        return res.json(handleSuccess(finalObj))
                                    }
                                    else return res.json(handleSuccess(finalProduct))
                                }
                            })
                        }
                    })
                }
                else {
                    return res.json(handleErr('Images are required'))
                }
            }
            else {
                return res.json(handleErr('Product Details can not be null'))
            }
        }
    });
});

//Get most viewed
app.post('/api/mostViewedProducts', (req, res) => {
    Product.find({ enabled: true,isDeleted:false }).sort({ views: -1 }).limit(10).populate('brand').populate('category').exec((err, docs) => {
        if (err) return res.json(handleErr(err))
        else {
            let products = docs.map((prod) => {
                let { subcategory, category } = prod
                if (category !== null) {
                    let { subcategories } = category
                    let productSubcategory = subcategories.map((sub) => {
                        return sub._id
                    })
                    let finalObj = Object.assign({}, prod._doc)
                    let finalSub = subcategories[productSubcategory.indexOf(subcategory)]
                    finalObj.itemSubCategory = finalSub
                    return finalObj
                }
                else return prod
            })
            return res.json(handleSuccess(products))
        }
    })
})

//Get newly Added products
app.post('/api/newAddedProducts', (req, res) => {
    Product.find({ enabled: true,isDeleted:false }).sort({ createdDate: -1 }).limit(10).populate('brand').populate('category').exec((err, docs) => {
        if (err) return res.json(handleErr(err))
        else {
            let products = docs.map((prod) => {
                let { subcategory, category } = prod
                if (category !== null) {
                    let { subcategories } = category
                    let productSubcategory = subcategories.map((sub) => {
                        return sub._id
                    })
                    let finalObj = Object.assign({}, prod._doc)
                    let finalSub = subcategories[productSubcategory.indexOf(subcategory)]
                    finalObj.itemSubCategory = finalSub
                    return finalObj
                }
                else return prod
            })
            return res.json(handleSuccess(products))
        }
    })
})

//Get filtered products (for brands, category, subcategory)
app.post('/api/filteredProducts', (req, res) => {
    if (req.body) {
        let query = req.body
        Product.find({ enabled: true,isDeleted:false, ...query }).sort({ createdDate: -1 }).populate('brand').populate('category').exec((err, docs) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(docs))
            }
        })
    } else {
        return res.json(handleErr('Query can not be null'))
    }
})

app.post('/api/viewProduct', (req, res) => {
    if (req.body.id) {
        let { id } = req.body
        Product.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).populate('brand').populate('category').exec((err, product) => {
            if (err) return res.json(handleErr(err))
            else {
                let { subcategory, category } = product
                if (category !== null) {
                    let { subcategories } = category
                    let productSubcategory = subcategories.map((sub) => {
                        return sub._id
                    })
                    let finalObj = Object.assign({}, product._doc)
                    let finalSub = subcategories[productSubcategory.indexOf(subcategory)]
                    finalObj.itemSubCategory = finalSub
                    return res.json(handleSuccess(finalObj))
                }
                else return res.json(handleSuccess(product))
            }
        })
    } else {
        return res.json(handleErr('Product can not be null'))
    }
})

//best selling products
app.post('/api/bestSellingProducts', (req, res) => {
    Product.find({ enabled: true,isDeleted:false }).sort({ sold: -1 }).limit(10).populate('brand').populate('category').exec((err, docs) => {
        if (err) return res.json(handleErr(err))
        else {
            let products = docs.map((prod) => {
                let { subcategory, category } = prod
                if (category !== null) {
                    let { subcategories } = category
                    let productSubcategory = subcategories.map((sub) => {
                        return sub._id
                    })
                    let finalObj = Object.assign({}, prod._doc)
                    let finalSub = subcategories[productSubcategory.indexOf(subcategory)]
                    finalObj.itemSubCategory = finalSub
                    return finalObj
                }
                else return prod
            })
            return res.json(handleSuccess(products))
        }
    })
})

//Update product
app.put('/api/updateProduct', (req, res) => {
    if (req.body.id) {
        let data = req.body
        let { id } = data
        Product.findByIdAndUpdate(id, data, { new: true }).populate('brand').populate('category').exec((err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                let { subcategory, category } = doc
                if (category !== null) {
                    let { subcategories } = category
                    let productSubcategory = subcategories.map((sub) => {
                        return sub._id
                    })
                    let finalObj = Object.assign({}, doc._doc)
                    let finalSub = subcategories[productSubcategory.indexOf(subcategory)]
                    finalObj.itemSubCategory = finalSub
                    return res.json(handleSuccess(finalObj))
                }
                else return res.json(handleSuccess(doc))
            }
        })
    } else {
        return res.json(handleErr('Product can not be null'))
    }
})


//Add stock in Product
app.put('/api/addProductStock', (req, res) => {
    if (req.body.id && req.body.newStock) {
        let { id, newStock } = req.body
        Product.findByIdAndUpdate(id, { $inc: { stock: newStock } }, { new: true }).populate('brand').populate('category').exec((err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                let { subcategory, category } = doc
                if (category !== null) {
                    let { subcategories } = category
                    let productSubcategory = subcategories.map((sub) => {
                        return sub._id
                    })
                    let finalObj = Object.assign({}, doc._doc)
                    let finalSub = subcategories[productSubcategory.indexOf(subcategory)]
                    finalObj.itemSubCategory = finalSub
                    return res.json(handleSuccess(finalObj))
                }
                else {
                    return res.json(handleSuccess(doc))
                }
            }
        })
    } else {
        return res.json(handleErr('Product can not be null'))
    }
})

//Disable Product
app.put('/api/disableProduct', (req, res) => {
    if (req.body.id) {
        let { id } = req.body
        Product.findByIdAndUpdate(id, { enabled: false }, { new: true }).populate('brand').populate('category').exec((err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                let { subcategory, category } = doc
                if (category !== null) {
                    let { subcategories } = category
                    let productSubcategory = subcategories.map((sub) => {
                        return sub._id
                    })
                    let finalObj = Object.assign({}, doc._doc)
                    let finalSub = subcategories[productSubcategory.indexOf(subcategory)]
                    finalObj.itemSubCategory = finalSub
                    return res.json(handleSuccess(finalObj))
                }
                else return res.json(handleSuccess(doc))
            }
        })
    } else {
        return res.json(handleErr('Product can not be null'))
    }
})

//Enable Product
app.put('/api/enableProduct', (req, res) => {
    if (req.body.id) {
        let { id } = req.body
        Product.findByIdAndUpdate(id, { enabled: true }, { new: true }).populate('brand').populate('category').exec((err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                let { subcategory, category } = doc
                if (category !== null) {
                    let { subcategories } = category
                    let productSubcategory = subcategories.map((sub) => {
                        return sub._id
                    })
                    let finalObj = Object.assign({}, doc._doc)
                    let finalSub = subcategories[productSubcategory.indexOf(subcategory)]
                    finalObj.itemSubCategory = finalSub
                    return res.json(handleSuccess(finalObj))
                }
                else return res.json(handleSuccess(doc))
            }
        })
    } else {
        return res.json(handleErr('Product can not be null'))
    }
})

//Get products bu page
app.post('/api/getProducts:page', (req, res) => {
    var page = req.params.page || 1;
    var perPage = 20;
    Product.find({isDeleted:false}).populate('brand').populate('category').skip((perPage * page) - perPage).limit(perPage).exec((err, data) => {
        if (err) return res.json(handleErr(err))
        else Product.countDocuments().exec((error, count) => {
            if (error) return res.json(handleErr(error))
            else {
                let products = data.map((prod) => {
                    let { subcategory, category } = prod
                    if (category !== null) {
                        let { subcategories } = category
                        let productSubcategory = subcategories.map((sub) => {
                            return sub._id
                        })
                        let finalObj = Object.assign({}, prod._doc)
                        // let index = )
                        let finalSub = subcategories[productSubcategory.indexOf(subcategory)]
                        finalObj.itemSubCategory = finalSub
                        // console.log('finalObj->',finalObj)
                        return finalObj
                    }
                    else return prod
                })
                return res.json(handleSuccess({
                    products,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    total: count
                }))
            }
        })
    })
})

//Set products
app.post('/api/setProducts', (req, res) => {
    Product.find({}).populate('category').exec((err, docs) => {
        if (err) return res.json(handleErr(err))
        docs.forEach((dat) => {
            if (dat._doc.category === null) {
                Product.findByIdAndUpdate(dat._id, { category: "60dc2dcb4146fe39045012a5" }, { new: true }).exec((errr, pro) => {
                    if (errr) return res.json(handleErr(errr))
                    else {

                    }
                })
            }
        })
    })
    setTimeout(() => {
        return res.json(handleSuccess('DONE'))
    }, 10000)
})

//Search Products
app.post('/api/searchProducts', (req, res) => {
    if (req.body.title) {
        Product.find({ title: { $regex: req.body.title + '.*' },isDeleted:false })
            .limit(20).populate('brand').populate('category')
            .exec((err, docs) => {
                if (err)
                    return res.json(handleErr(err))
                else {
                    let products = docs.map((prod) => {
                        let { subcategory, category } = prod
                        if (category !== null) {
                            let { subcategories } = category
                            let productSubcategory = subcategories.map((sub) => {
                                return sub._id
                            })
                            let finalObj = Object.assign({}, prod._doc)
                            // let index = )
                            let finalSub = subcategories[productSubcategory.indexOf(subcategory)]
                            finalObj.itemSubCategory = finalSub
                            // console.log('finalObj->',finalObj)
                            return finalObj
                        }
                        else return prod
                    })
                    return res.json(handleSuccess(products))
                }
            });
    } else {
        return res.json(handleErr('Title can not be null'))
    }
})

//bulk Data
app.post('/api/bulkProducts', (req, res) => {
    let categoryData = [
        {
            category: "60a5b82bc63e197a3a057072",
            subcategory: "60a5bc593d7445220ca5f11b",
        },
        {
            category: "60a5b82bc63e197a3a057072",
            subcategory: "60a5bc783d7445220ca5f11c",
        },
        {
            category: "60a5b82bc63e197a3a057072",
            subcategory: "60a5bc8a3d7445220ca5f11d",
        },
        {
            category: "60a5b852c63e197a3a057074",
            subcategory: "60a5bcc43d7445220ca5f11e",
        },
        {
            category: "60a5b852c63e197a3a057074",
            subcategory: "60a5bcd43d7445220ca5f11f",
        },
        {
            category: "60a5b852c63e197a3a057074",
            subcategory: "60a5bcee3d7445220ca5f120"
        }
    ]
    let min = Math.ceil(0);
    let max = Math.floor(5);
    let data = req.body.products
    data.forEach((prod) => {
        let random = Math.floor(Math.random() * (max - min + 1)) + min;
        prod.category = categoryData[random].category
        prod.subcategory = categoryData[random].subcategory
        prod.images = ["http://dummyimage.com/386x297.png/ff4444/ffffff", "http://dummyimage.com/293x233.png/ff4444/ffffff", "http://dummyimage.com/368x394.png/dddddd/000000"]
        Product.create(prod, (err, doc) => {
            if (err) return res.json(handleErr(err))
        })
    })
    setTimeout(() => {
        return res.json(handleSuccess('Done'))
    }, 10000)
})

//Delete all products

app.get('/api/deleteAllProducts', (req, res) => {
    Product.deleteMany({}).exec((err, docs) => {
        if (err) return res.json(handleErr(err))
        else {
            return res.json(handleSuccess(docs))
        }
    })
})

//randomy set sold and views
app.get('/api/updateProductViews', (req, res) => {
    Product.find({ enabled: true }, (err, docs) => {
        if (err) return res.json(handleErr(err))
        else {
            let min = Math.ceil(10);
            let max = Math.floor(5000);
            let responss = []
            docs.forEach((prod) => {
                let randomSold = Math.floor(Math.random() * (max - min + 1)) + min;
                let randomViews = Math.floor(Math.random() * (max - min + 1)) + min;
                let id = prod._id
                Product.findByIdAndUpdate(id, { $set: { views: randomViews, sold: randomSold } }, { new: true }, (errr, doccc) => {
                    if (errr) return res.json(errr)
                    else {
                        responss.push(doccc)
                    }
                })
            })
            setTimeout(() => {
                return res.json(handleSuccess({ modified: responss.length }))
            }, 10000)
        }
    })
})


//Get Products by category
app.post('/api/getProductsByCategory', (req, res) => {
    if (req.body.category) {
        let { category } = req.body
        Product.find({ category: category, enabled: true,isDeleted:false }).populate('brand').populate('category').exec((err, docs) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(docs))
            }
        })
    } else {
        return res.json(handleErr('category can not be null'))
    }
})

//get products by brand
app.post('/api/sfdhfiugeadhsiljxzk', (req, res) => {
    if (req.body.brand) {
        let { brand } = req.body
        Product.find({ brand: new ObjectId(brand), enabled: true,isDeleted:false }).populate('brand').populate('category').exec((err, docs) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(docs))
            }
        })
    } else {
        return res.json(handleErr('Brand can not be null'))
    }
})

//Get products by cateogry
app.post('/api/productsByCatAndSubcat', (req, res) => {
    if (req.body.category && req.body.subcategory) {
        let { category, subcategory } = req.body
        Product.find({ category: category, enabled: true, subcategory,isDeleted:false }).populate('brand').populate('category').exec((err, docs) => {
            if (err) return res.json(handleErr(err))
            else {
                let products = docs.map((prod) => {
                    let { subcategory, category } = prod
                    if (category !== null) {
                        let { subcategories } = category
                        let productSubcategory = subcategories.map((sub) => {
                            return sub._id
                        })
                        let finalObj = Object.assign({}, prod._doc)
                        // let index = )
                        let finalSub = subcategories[productSubcategory.indexOf(subcategory)]
                        finalObj.itemSubCategory = finalSub
                        // console.log('finalObj->',finalObj)
                        return finalObj
                    }
                    else return prod
                })
                return res.json(handleSuccess(products))
            }
        })
    } else {
        return res.json(handleErr('category can not be null'))
    }
})

app.post('/api/bulkUpdateLinks', (req, res) => {
    Product.find({}, (err, docs) => {
        if (err) return res.json(handleErr(err))
        else {
            docs.forEach((doc, index) => {
                let { images } = doc._doc
                if (images !== null && images !== []) {
                    let newImages = images.map((image) => {
                        return image.replace('https', 'http')
                    })
                    Product.findByIdAndUpdate(doc._id, {
                        $set: { images: newImages }
                    }, { new: true }).exec((errr, doccc) => {
                        if (errr) return res.json(handleErr(errr))
                    })
                }
            })
            setTimeout(() => {
                return res.json(handleSuccess('DONE'))
            }, 10000)
        }
    })
})

//Add bulk products
app.post('/api/addBulkProducts', (req, res) => {
    let data = req.body.products
    let categories = [
        {
            category: "6107ecdaef6b3008477a0f4d",
            subcategory: "6107ecdbef6b3008477a0f53"
        },
        {
            category: "6107ecdaef6b3008477a0f4d",
            subcategory: "6107ecdbef6b3008477a0f54"
        },
        {
            category: "6107ecdaef6b3008477a0f4d",
            subcategory: "6107ecdbef6b3008477a0f59"
        },
        {
            category: "6107ecdaef6b3008477a0f4d",
            subcategory: "6107ecdbef6b3008477a0f57"
        },
        {
            category: "6107ecdaef6b3008477a0f4d",
            subcategory: "6107ecdbef6b3008477a0f58"
        },
        {
            category: "6107ecdaef6b3008477a0f4d",
            subcategory: "6107ecdbef6b3008477a0f55"
        },
        {
            category: "6107ecdaef6b3008477a0f4d",
            subcategory: "6107ecdbef6b3008477a0f5a"
        },
        {
            category: "6107ecdaef6b3008477a0f4d",
            subcategory: "6107ecdbef6b3008477a0f56"
        },
        {
            category: "6107ecdaef6b3008477a0f4c",
            subcategory: "6107ecdbef6b3008477a0f63"
        },
        {
            category: "6107ecdaef6b3008477a0f4c",
            subcategory: "6107ecdbef6b3008477a0f68"
        },
        {
            category: "6107ecdaef6b3008477a0f4c",
            subcategory: "6107ecdbef6b3008477a0f64"
        },
        {
            category: "6107ecdaef6b3008477a0f4c",
            subcategory: "6107ecdbef6b3008477a0f66"
        },
        {
            category: "6107ecdaef6b3008477a0f4c",
            subcategory: "6107ecdbef6b3008477a0f69"
        },
        {
            category: "6107ecdaef6b3008477a0f4c",
            subcategory: "6107ecdbef6b3008477a0f67"
        },
        {
            category: "6107ecdaef6b3008477a0f4c",
            subcategory: "6107ecdbef6b3008477a0f65"
        },
        {
            category: "6107ecdaef6b3008477a0f4c",
            subcategory: "6107ecdbef6b3008477a0f6a"
        },
        {
            category: "6107ecdaef6b3008477a0f4e",
            subcategory: "6107ecdbef6b3008477a0f6d"
        },
        {
            category: "6107ecdaef6b3008477a0f4e",
            subcategory: "6107ecdbef6b3008477a0f6f"
        },
        {
            category: "6107ecdaef6b3008477a0f4e",
            subcategory: "6107ecdbef6b3008477a0f6e"
        },
        {
            category: "6107ecdaef6b3008477a0f4e",
            subcategory: "6107ecdbef6b3008477a0f6b"
        },
        {
            category: "6107ecdaef6b3008477a0f4e",
            subcategory: "6107ecdbef6b3008477a0f6c"
        },
        {
            category: "6107ecdaef6b3008477a0f4e",
            subcategory: "6107ecdbef6b3008477a0f70"
        },
        {
            category: "6107ecdaef6b3008477a0f4e",
            subcategory: "6107ecdbef6b3008477a0f71"
        },
        {
            category: "6107ecdaef6b3008477a0f4e",
            subcategory: "6107ecdbef6b3008477a0f72"
        },
        {
            category: "6107ecdaef6b3008477a0f4b",
            subcategory: "6107ecdbef6b3008477a0f5e"
        },
        {
            category: "6107ecdaef6b3008477a0f4b",
            subcategory: "6107ecdbef6b3008477a0f5c"
        },
        {
            category: "6107ecdaef6b3008477a0f4b",
            subcategory: "6107ecdbef6b3008477a0f5d"
        },
        {
            category: "6107ecdaef6b3008477a0f4b",
            subcategory: "6107ecdbef6b3008477a0f5f"
        },
        {
            category: "6107ecdaef6b3008477a0f4b",
            subcategory: "6107ecdbef6b3008477a0f61"
        },
        {
            category: "6107ecdaef6b3008477a0f4b",
            subcategory: "6107ecdbef6b3008477a0f62"
        },
        {
            category: "6107ecdaef6b3008477a0f4b",
            subcategory: "6107ecdbef6b3008477a0f5b"
        },
        {
            category: "6107ecdaef6b3008477a0f4b",
            subcategory: "6107ecdbef6b3008477a0f60"
        },
        {
            category: "6107ecdaef6b3008477a0f51",
            subcategory: "6107ecdbef6b3008477a0f8c"
        },
        {
            category: "6107ecdaef6b3008477a0f51",
            subcategory: "6107ecdbef6b3008477a0f8d"
        },
        {
            category: "6107ecdaef6b3008477a0f51",
            subcategory: "6107ecdbef6b3008477a0f8f"
        },
        {
            category: "6107ecdaef6b3008477a0f51",
            subcategory: "6107ecdbef6b3008477a0f92"
        },
        {
            category: "6107ecdaef6b3008477a0f51",
            subcategory: "6107ecdbef6b3008477a0f8e"
        },
        {
            category: "6107ecdaef6b3008477a0f51",
            subcategory: "6107ecdbef6b3008477a0f8b"
        },
        {
            category: "6107ecdaef6b3008477a0f51",
            subcategory: "6107ecdbef6b3008477a0f91"
        },
        {
            category: "6107ecdaef6b3008477a0f51",
            subcategory: "6107ecdbef6b3008477a0f90"
        },
        {
            category: "6107ecdaef6b3008477a0f52",
            subcategory: "6107ecdbef6b3008477a0f73"
        },
        {
            category: "6107ecdaef6b3008477a0f52",
            subcategory: "6107ecdbef6b3008477a0f75"
        },
        {
            category: "6107ecdaef6b3008477a0f52",
            subcategory: "6107ecdbef6b3008477a0f74"
        },
        {
            category: "6107ecdaef6b3008477a0f52",
            subcategory: "6107ecdbef6b3008477a0f78"
        },
        {
            category: "6107ecdaef6b3008477a0f52",
            subcategory: "6107ecdbef6b3008477a0f77"
        },
        {
            category: "6107ecdaef6b3008477a0f52",
            subcategory: "6107ecdbef6b3008477a0f7a"
        },
        {
            category: "6107ecdaef6b3008477a0f52",
            subcategory: "6107ecdbef6b3008477a0f79"
        },
        {
            category: "6107ecdaef6b3008477a0f52",
            subcategory: "6107ecdbef6b3008477a0f76"
        },
        {
            category: "6107ecdaef6b3008477a0f50",
            subcategory: "6107ecdbef6b3008477a0f83"
        },
        {
            category: "6107ecdaef6b3008477a0f50",
            subcategory: "6107ecdbef6b3008477a0f84"
        },
        {
            category: "6107ecdaef6b3008477a0f50",
            subcategory: "6107ecdbef6b3008477a0f85"
        },
        {
            category: "6107ecdaef6b3008477a0f50",
            subcategory: "6107ecdbef6b3008477a0f86"
        },
        {
            category: "6107ecdaef6b3008477a0f50",
            subcategory: "6107ecdbef6b3008477a0f88"
        },
        {
            category: "6107ecdaef6b3008477a0f50",
            subcategory: "6107ecdbef6b3008477a0f87"
        },
        {
            category: "6107ecdaef6b3008477a0f50",
            subcategory: "6107ecdbef6b3008477a0f8a"
        },
        {
            category: "6107ecdaef6b3008477a0f50",
            subcategory: "6107ecdbef6b3008477a0f89"
        },
        {
            category: "6107ecdaef6b3008477a0f4f",
            subcategory: "6107ecdbef6b3008477a0f7c"
        },
        {
            category: "6107ecdaef6b3008477a0f4f",
            subcategory: "6107ecdbef6b3008477a0f7e"
        },
        {
            category: "6107ecdaef6b3008477a0f4f",
            subcategory: "6107ecdbef6b3008477a0f7d"
        },
        {
            category: "6107ecdaef6b3008477a0f4f",
            subcategory: "6107ecdbef6b3008477a0f81"
        },
        {
            category: "6107ecdaef6b3008477a0f4f",
            subcategory: "6107ecdbef6b3008477a0f82"
        },
        {
            category: "6107ecdaef6b3008477a0f4f",
            subcategory: "6107ecdbef6b3008477a0f7f"
        },
        {
            category: "6107ecdaef6b3008477a0f4f",
            subcategory: "6107ecdbef6b3008477a0f7b"
        },
        {
            category: "6107ecdaef6b3008477a0f4f",
            subcategory: "6107ecdbef6b3008477a0f80"
        }
    ]
    let min = Math.ceil(0);
    let max = Math.floor(categories.length-1);
    data.forEach((prod) => {
        let random = Math.floor(Math.random() * (max - min + 1)) + min;
        prod.category = categories[random].category
        prod.subcategory = categories[random].subcategory
        let files = [
            "files-1627908307859",
            "files-1627908307860",
            "files-1627908307860",
            "files-1627908307861",
            "files-1627908307862",
            "files-1627908307863",
            "files-1627908307864",
            "files-1627908307865"
        ]
        shuffleArray(files)
        prod.images = files.slice(0, random)
        Product.create(prod, (err, doc) => {
            if (err) return res.json(handleErr(err))
            else {

            }
        })
    })
    setTimeout(() => {
        return res.json(handleSuccess('DONE'))
    }, 15000)
})

//Delete products
app.delete('/api/deleteProduct',(req,res)=>{
    if(req.body.id){
        let {id} = req.body
        Product.findByIdAndUpdate(id,{isDeleted:true},{new:true}).exec((err,doc)=>{
            if(err)return res.json(handleErr(err))
            else{
                return res.json(handleSuccess(doc))
            }
        })
    }else{
        return res.json(handleErr('Product can not be null'))
    }
})

//set is deleted
// app.get('/api/setIsDeletedProducts',(req,res)=>{
//     Product.updateMany({},{isDeleted:false},(err,docs)=>{
//         if(err)return res.json(handleErr(err))
//         else{
//             return res.json(handleSuccess(docs))
//         }
//     })
// })
module.exports = app