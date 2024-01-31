const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name']
        },
        {
          model: Tag,
          attributes: ['id', 'tag_name'],
          through: ProductTag,
          as: 'tags'
        }
      ]
    });
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get one product by its ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name']
        },
        {
          model: Tag,
          attributes: ['id', 'tag_name'],
          through: ProductTag,
          as: 'tags'
        }
      ]
    });
    if (!product) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const [rowsAffected] = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (rowsAffected === 0) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }

    // Update product tags if `tagIds` is provided in the request body
    if (req.body.tagIds) {
      const currentProductTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });
      const currentProductTagIds = currentProductTags.map(tag => tag.tag_id);

      const newProductTags = req.body.tagIds
        .filter(tag_id => !currentProductTagIds.includes(tag_id))
        .map(tag_id => ({ product_id: req.params.id, tag_id }));

      const productTagsToRemove = currentProductTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(tag => tag.id);

      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }

    const updatedProduct = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag, through: ProductTag, as: 'tags' }],
    });

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete one product by its ID
router.delete('/:id', async (req, res) => {
  try {
    const rowsAffected = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (rowsAffected === 0) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }

    res.status(200).json({ message: 'Product deleted!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
