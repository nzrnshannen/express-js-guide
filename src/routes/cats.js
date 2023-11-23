const mysql = require('mysql2');
const cors = require('cors');
const { Router } = require('express');

const router = Router();
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'journal_db'
});

router.get('/', (req, res) => {
    connection.query('SELECT * FROM cats', (err, results) => {
        if(err)
        {
            console.error('Error fetching cats data from database:', err);
            res.status(500).send({message: 'Internal Server Error'});
        }
        else
        {
            res.send(results);
        }
    })
});

router.post('/addCat', (req, res) => {
    const cat_name = req.body.name;
    const cat_age = req.body.age;
    const cat_color = req.body.color;

    connection.query(`INSERT INTO cats (name, age, color) 
    VALUES ("${cat_name}", "${cat_age}", "${cat_color}")`, (err) => {
        if(err)
        {
            console.error('Error creating data!');
        }
        else
        {
            res.json({message: 'Successfully added a cat in the database!'});
        }
    }) 
})

router.put('/updateCat/:cat_id', (req, res) => {
    const cat_id = parseInt(req.params.cat_id, 10);
    const new_name = req.body.name; 
    const new_age = parseInt(req.body.age, 10); 
    const new_color = req.body.color; 

    connection.query(
        'SELECT * FROM cats WHERE cat_id = ?', [cat_id], (searchErr, searchResults) => {
            if(searchErr)
            {
                console.error(`Error searching for cat #${cat_id}: ${searchErr}`);
                res.status(500).send(`Error searching for cat #${cat_id}`);
            }
            else if(searchResults.length===0)
            {
                res.send({message: `Data for cat #${cat_id} doesn't exist!`});
            }
            else
            {
                connection.query(
                    'UPDATE cats SET name = ?, age = ?, color = ? WHERE cat_id = ?', 
                    [new_name, new_age, new_color, cat_id], 
                    (updateErr) => 
                    { 
                        if(updateErr) 
                        {
                            console.error(updateErr);
                            res.status(500).send(`Error updating cat #${cat_id}`);
                        }
                        else
                        {
                            res.send({message: `Cat #${cat_id} updated successfully.`}) 
                        }
                    }
                )
            }
        }
    )
})

router.delete('/deleteCat/:cat_id', (req, res) => {
    const cat_id = parseInt(req.params.cat_id, 10);
    connection.query(
        'SELECT * FROM cats WHERE cat_id = ?', [cat_id], (searchErr, searchResults) => {
            if(searchErr)
            {
                console.error(`Error searching for cat #${cat_id}: ${searchErr}`);
                res.status(500).send(`Error searching for cat #${cat_id}`);
            }
            else if(searchResults.length === 0)
            {
                res.send({message: `Data for cat #${cat_id} doesn't exist!`});
            }
            else
            {
                connection.query(
                    'DELETE FROM cats WHERE cat_id = ?', [cat_id], (deleteErr) => {
                        if(deleteErr)
                        {
                            console.error(this.deleteErr);
                            res.status(500).send(`Error deleting cat #${cat_id}`);
                        }
                        else
                        {
                            res.send({message: `Cat #${cat_id} successfully deleted.`});
                        }
                    }
                )
            }
            
        }
    )
});

module.exports = router;

