const router = require('express').Router();
const { Category, Product } = require('../../models');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// GET a single category by its ID
router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// POST a new category
router.post('/', async (req, res) => {
  console.log('POST Request Body:', req.body); // Console log to check incoming request data
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// PUT to update a category by its ID
router.put('/:id', async (req, res) => {
  try {
    const [updateCount] = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (updateCount === 0) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    const updatedCategory = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    res.status(200).json(updatedCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// DELETE a category by its ID
router.delete('/:id', async (req, res) => {
  try {
    // Check if any products are associated with this category
    const associatedProducts = await Product.findAll({
      where: { category_id: req.params.id },
    });

    if (associatedProducts.length > 0) {
      res.status(400).json({ message: 'Category has associated products and cannot be deleted' });
      return;
    }

    const deletedCategory = await Category.destroy({
      where: { id: req.params.id },
    });

    if (!deletedCategory) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

module.exports = router;
