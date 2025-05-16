const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Customer = require('./models/Customer');
const Order = require('./models/Order');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

mongoose.connect('mongodb://0.0.0.0:27017/miniCRM');

const db = mongoose.connection;
db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    await Customer.deleteMany({});
    await Order.deleteMany({});

    const customers = [];
    const orders = [];

    const totalCustomers = 20000;
    const newCustomersCount = Math.floor(totalCustomers * 0.33);
    const repeatCustomersCount = totalCustomers - newCustomersCount;
    const cityOptions = ['Delhi', 'Mumbai', 'Bangalore'];
    const joinChannels = ['online', 'offline', 'app'];
    const contactChannels = ['email', 'sms', 'push'];
    const languages = ['English', 'Hindi', 'Tamil'];

    for (let i = 1; i <= totalCustomers; i++) {
      const isRepeat = i > newCustomersCount;
      const customerId = i.toString();
      const numberOfVisits = isRepeat ? faker.number.int({ min: 2, max: 20 }) : 1;

      const customer = new Customer({
        id: faker.string.uuid(),
        customer_id: customerId,
        merchant_id: '2543',
        phone: '+91' + faker.phone.number('9#########'),
        customer_email: faker.internet.email(),
        customer_name: faker.name.fullName(),
        last_visited: faker.date.recent(),
        number_of_visits: numberOfVisits,
        join_channel: faker.helpers.arrayElement(joinChannels),
        is_active: 1,
        created_on: faker.date.past(),
        first_event: faker.number.int({ min: 100000, max: 999999 }).toString(),
        last_event: faker.number.int({ min: 100000, max: 999999 }).toString(),
        last_location: faker.helpers.arrayElement(cityOptions),
        last_channel: faker.helpers.arrayElement(contactChannels),
        total_spend: faker.number.int({ min: 1000, max: 50000 }),
        join_location: faker.address.city(),
        loyalty_conf_id: faker.string.uuid(),
        usecase: faker.commerce.department(),
        pincode: faker.address.zipCode(),
        gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
        nationality: 'Indian',
        birthday: faker.date.past(30, new Date('2005-01-01')),
        country: 'India',
        city: faker.address.city(),
        state: faker.address.state(),
        language: faker.helpers.arrayElement(languages),
      });

      customers.push(customer);

      
      const orderCount = isRepeat ? faker.number.int({ min: 2, max: 5 }) : 1;

      for (let j = 0; j < orderCount; j++) {
        const order = new Order({
          id: faker.string.uuid(),
          customer_id: customerId,
          merchant_id: '2543',
          amount: faker.finance.amount(50, 5000),
          discount: faker.number.int({ min: 0, max: 500 }),
          channel: faker.helpers.arrayElement(['app', 'web', 'store']),
          type: faker.helpers.arrayElement(['purchase', 'return']),
          status: faker.number.int({ min: 0, max: 1 }),
          bill_no: faker.string.uuid(),
          created_on: faker.date.recent(),
          location_id: faker.number.int({ min: 1000, max: 9999 }).toString(),
        });
        orders.push(order);
      }
    }

    await Customer.insertMany(customers);
    console.log(`${customers.length} Customers created.`);

    await Order.insertMany(orders);
    console.log(`${orders.length} Orders created.`);

  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    mongoose.connection.close();
  }
});
