import { PayPalPayment } from './PayPalPayment';
import { CreditCardPayment } from './CreditCardPayment';
import { BitcoinPayment } from './BitcoinPayment';
import { PaymentTransaction } from './PaymentTransaction';

// Création des instances des méthodes de paiement
const paypal = new PayPalPayment();
const creditCard = new CreditCardPayment();
const bitcoin = new BitcoinPayment();

// Créer et traiter une transaction PayPal
const paypalTransaction = new PaymentTransaction(paypal, 100);
paypalTransaction.processTransaction();

// Créer et traiter une transaction par carte de crédit
const cardTransaction = new PaymentTransaction(creditCard, 200);
cardTransaction.processTransaction();

// Créer et traiter une transaction Bitcoin
const bitcoinTransaction = new PaymentTransaction(bitcoin, 300);
bitcoinTransaction.processTransaction();
