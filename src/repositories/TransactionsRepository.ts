import Transaction from '../models/Transaction';
// import CreateTransactionService from '../services/CreateTransactionService';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactonDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface TransactionALl {
  transaction: [];
  balance: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all() {
    const all = {
      transactions: this.transactions,
      balance: this.getBalance(),
    };
    return all;
  }

  public getBalance(): Balance {
    const incomesAll = this.transactions.filter(
      index => index.type === 'income',
    );
    const outcomesAll = this.transactions.filter(
      index => index.type === 'outcome',
    );

    const getIncomesValues = incomesAll.map(index => index.value);
    const getOutcomesValues = outcomesAll.map(index => index.value);

    const totalIncomes = getIncomesValues.reduce(
      (total, numero) => total + numero,
      0,
    );
    const totalOutcomes = getOutcomesValues.reduce(
      (total, numero) => total + numero,
      0,
    );

    const totalBalance = totalIncomes - totalOutcomes;

    const balance = {
      income: totalIncomes,
      outcome: totalOutcomes,
      total: totalBalance,
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransactonDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
