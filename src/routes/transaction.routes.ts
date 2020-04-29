import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();

    return response.json(transactions);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body;

    if (type !== 'outcome' && type !== 'income') {
      return response.status(400).json({ error: 'Type dont is correct' });
    }
    if (type === 'outcome') {
      const transactionsBalance = transactionsRepository.getBalance();
      if (value > transactionsBalance.total) {
        return response.status(400).json({
          error:
            'This operation is not suported, becouse your balance is less than the amount entered',
        });
      }
    }

    const createTransaction = new CreateTransactionService(
      transactionsRepository,
    );

    const transaction = createTransaction.execute({
      title,
      value,
      type,
    });

    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
