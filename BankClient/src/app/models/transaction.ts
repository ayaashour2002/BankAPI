export interface Transaction {
  id: number;
  amount: number;
  type: string;
  description: string;
  date: string;
  fromAccount: string;
  toAccount: string;
  direction: 'in' | 'out';
}
