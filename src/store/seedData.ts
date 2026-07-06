import { Market, Shop, Garage, Payment, BackupRecord } from '../types';

export const seedMarkets: Market[] = [
  { id: 'm1', name: 'Market A', phoneNumber: '9876543210', monthlyRent: 5000, address: '12 Main Street', createdAt: '2024-01-01' },
  { id: 'm2', name: 'Market B', phoneNumber: '9812345678', monthlyRent: 5000, address: '45 Park Avenue', createdAt: '2024-01-15' },
  { id: 'm3', name: 'Market C', phoneNumber: '9834567890', monthlyRent: 6000, address: '78 Lake Road', createdAt: '2024-02-01' },
  { id: 'm4', name: 'Market D', phoneNumber: '9123456780', monthlyRent: 4500, address: '23 Hill View', createdAt: '2024-02-15' },
  { id: 'm5', name: 'Market E', phoneNumber: '9900556677', monthlyRent: 3800, address: '56 Garden Lane', createdAt: '2024-03-01' },
  { id: 'm6', name: 'Market F', phoneNumber: '9871112233', monthlyRent: 5500, address: '89 Station Road', createdAt: '2024-03-15' },
  { id: 'm7', name: 'Market G', phoneNumber: '9811223344', monthlyRent: 4700, address: '34 College Street', createdAt: '2024-04-01' },
  { id: 'm8', name: 'Market H', phoneNumber: '9898765432', monthlyRent: 3600, address: '67 Temple Road', createdAt: '2024-04-15' },
  { id: 'm9', name: 'Market I', phoneNumber: '9867001122', monthlyRent: 4200, address: '90 Market Place', createdAt: '2024-05-01' },
  { id: 'm10', name: 'Market J', phoneNumber: '9878123400', monthlyRent: 4800, address: '12 Commerce Street', createdAt: '2024-05-15' },
  { id: 'm11', name: 'Market K', phoneNumber: '9823001234', monthlyRent: 5200, address: '45 Bazaar Lane', createdAt: '2024-06-01' },
  { id: 'm12', name: 'Market L', phoneNumber: '9845678901', monthlyRent: 4100, address: '78 Trade Road', createdAt: '2024-06-15' },
];

export const seedShops: Shop[] = [
  { id: 's1', marketId: 'm1', shopName: 'Shop A-01', tenantName: 'Mr. Roy', phoneNumber: '9876543210', monthlyRent: 5000, paidRent: 5000, currentDue: 0, dueDate: '2026-06-10', paymentStatus: 'Paid', shopType: 'Rented', startDate: '2024-01-01', endDate: '2026-12-31' },
  { id: 's2', marketId: 'm1', shopName: 'Shop A-02', tenantName: 'Mr. Das', phoneNumber: '9812345678', monthlyRent: 5000, paidRent: 0, currentDue: 5000, dueDate: '2026-06-15', paymentStatus: 'Due', shopType: 'Rented', startDate: '2024-01-15', endDate: '2026-12-31' },
  { id: 's3', marketId: 'm1', shopName: 'Shop A-03', tenantName: 'Mr. Khan', phoneNumber: '9834567890', monthlyRent: 6000, paidRent: 6000, currentDue: 0, dueDate: '2026-06-20', paymentStatus: 'Paid', shopType: 'Rented', startDate: '2024-02-01', endDate: '2027-01-31' },
  { id: 's4', marketId: 'm1', shopName: 'Shop A-04', tenantName: 'Mr. Ali', phoneNumber: '9123456780', monthlyRent: 4500, paidRent: 0, currentDue: 4500, dueDate: '2026-06-25', paymentStatus: 'Due', shopType: 'Rented', startDate: '2024-02-15', endDate: '2026-11-30' },
  { id: 's5', marketId: 'm1', shopName: 'Shop A-05', tenantName: 'Mr. Paul', phoneNumber: '9900556677', monthlyRent: 5500, paidRent: 5500, currentDue: 0, dueDate: '2026-07-05', paymentStatus: 'Paid', shopType: 'Rented', startDate: '2024-03-01', endDate: '2027-02-28' },
  { id: 's6', marketId: 'm1', shopName: 'Shop A-06', tenantName: 'Mr. Sen', phoneNumber: '9871112233', monthlyRent: 7000, paidRent: 7000, currentDue: 0, dueDate: '2026-07-10', paymentStatus: 'Paid', shopType: 'Leased', startDate: '2024-03-15', endDate: '2028-03-14' },
  { id: 's7', marketId: 'm1', shopName: 'Shop A-07', tenantName: 'Mr. Yadav', phoneNumber: '9811223344', monthlyRent: 6000, paidRent: 0, currentDue: 6000, dueDate: '2026-07-15', paymentStatus: 'Due', shopType: 'Leased', startDate: '2024-04-01', endDate: '2027-03-31' },
  { id: 's8', marketId: 'm1', shopName: 'Shop A-08', tenantName: 'Mr. Sharma', phoneNumber: '9122334455', monthlyRent: 5500, paidRent: 5500, currentDue: 0, dueDate: '2026-07-20', paymentStatus: 'Paid', shopType: 'Leased', startDate: '2024-04-15', endDate: '2027-04-14' },
  { id: 's9', marketId: 'm2', shopName: 'Shop B-01', tenantName: 'Mr. Gupta', phoneNumber: '9876000001', monthlyRent: 5000, paidRent: 5000, currentDue: 0, dueDate: '2026-06-10', paymentStatus: 'Paid', shopType: 'Rented', startDate: '2024-01-01', endDate: '2026-12-31' },
  { id: 's10', marketId: 'm2', shopName: 'Shop B-02', tenantName: 'Mr. Verma', phoneNumber: '9876000002', monthlyRent: 5000, paidRent: 0, currentDue: 5000, dueDate: '2026-06-15', paymentStatus: 'Due', shopType: 'Rented', startDate: '2024-01-15', endDate: '2026-12-31' },
  { id: 's11', marketId: 'm3', shopName: 'Shop C-01', tenantName: 'Mr. Jain', phoneNumber: '9876000003', monthlyRent: 6000, paidRent: 6000, currentDue: 0, dueDate: '2026-06-20', paymentStatus: 'Paid', shopType: 'Rented', startDate: '2024-02-01', endDate: '2027-01-31' },
  { id: 's12', marketId: 'm3', shopName: 'Shop C-02', tenantName: 'Mr. Bose', phoneNumber: '9876000004', monthlyRent: 4500, paidRent: 0, currentDue: 4500, dueDate: '2026-06-25', paymentStatus: 'Due', shopType: 'Leased', startDate: '2024-02-15', endDate: '2026-11-30' },
];

export const seedGarages: Garage[] = [
  { id: 'g1', garageNo: 'G-01', ownerName: 'Mr. Arnab Roy', mobileNumber: '9876543210', vehicleNumber: 'WB 02 AB 1234', vehicleType: 'Car', monthlyRent: 5000, paymentStatus: 'Paid', currentDue: 0, leaseEndDate: '2028-12-31', leaseType: 'Long-term', startDate: '2024-01-01' },
  { id: 'g2', garageNo: 'G-02', ownerName: 'Mr. Subhajit Das', mobileNumber: '9812345678', vehicleNumber: 'WB 06 CD 5678', vehicleType: 'Car', monthlyRent: 5000, paymentStatus: 'Due', currentDue: 5000, leaseEndDate: '2029-01-31', leaseType: 'Yearly', startDate: '2024-01-15' },
  { id: 'g3', garageNo: 'G-03', ownerName: 'Mr. Rajesh Khan', mobileNumber: '9834567890', vehicleNumber: 'WB 02 EF 9012', vehicleType: 'Car', monthlyRent: 6000, paymentStatus: 'Paid', currentDue: 0, leaseEndDate: '2029-03-14', leaseType: 'Long-term', startDate: '2024-02-01' },
  { id: 'g4', garageNo: 'G-04', ownerName: 'Mr. Imran Ali', mobileNumber: '9123456780', vehicleNumber: 'WB 04 GH 3456', vehicleType: 'Bike', monthlyRent: 4500, paymentStatus: 'Due', currentDue: 4500, leaseEndDate: '2028-03-31', leaseType: 'Monthly', startDate: '2024-02-15' },
  { id: 'g5', garageNo: 'G-05', ownerName: 'Mr. Pritam Paul', mobileNumber: '9900556677', vehicleNumber: 'WB 02 IJ 7890', vehicleType: 'Car', monthlyRent: 5000, paymentStatus: 'Paid', currentDue: 0, leaseEndDate: '2029-04-30', leaseType: 'Yearly', startDate: '2024-03-01' },
  { id: 'g6', garageNo: 'G-06', ownerName: 'Mr. Suman Sen', mobileNumber: '9871112233', vehicleNumber: 'WB 06 KL 2345', vehicleType: 'Truck', monthlyRent: 7000, paymentStatus: 'Paid', currentDue: 0, leaseEndDate: '2029-05-31', leaseType: 'Long-term', startDate: '2024-03-15' },
  { id: 'g7', garageNo: 'G-07', ownerName: 'Mr. Arindam Yadav', mobileNumber: '9811223344', vehicleNumber: 'WB 02 MN 6789', vehicleType: 'Car', monthlyRent: 6000, paymentStatus: 'Due', currentDue: 6000, leaseEndDate: '2028-05-31', leaseType: 'Monthly', startDate: '2024-04-01' },
  { id: 'g8', garageNo: 'G-08', ownerName: 'Mr. Rakesh Sharma', mobileNumber: '9122334455', vehicleNumber: 'WB 04 OP 1357', vehicleType: 'Car', monthlyRent: 5500, paymentStatus: 'Paid', currentDue: 0, leaseEndDate: '2029-06-30', leaseType: 'Yearly', startDate: '2024-04-15' },
  { id: 'g9', garageNo: 'G-09', ownerName: 'Mr. Sourav Ghosh', mobileNumber: '9900112233', vehicleNumber: 'WB 05 QR 2468', vehicleType: 'Bike', monthlyRent: 3500, paymentStatus: 'Paid', currentDue: 0, leaseEndDate: '2028-07-31', leaseType: 'Monthly', startDate: '2024-05-01' },
  { id: 'g10', garageNo: 'G-10', ownerName: 'Mr. Biplab Dey', mobileNumber: '9875432100', vehicleNumber: 'WB 03 ST 1357', vehicleType: 'Car', monthlyRent: 5000, paymentStatus: 'Due', currentDue: 5000, leaseEndDate: '2029-08-31', leaseType: 'Yearly', startDate: '2024-05-15' },
  { id: 'g11', garageNo: 'G-11', ownerName: 'Mr. Kamal Nath', mobileNumber: '9862341100', vehicleNumber: 'WB 07 UV 9876', vehicleType: 'Car', monthlyRent: 6500, paymentStatus: 'Paid', currentDue: 0, leaseEndDate: '2029-09-30', leaseType: 'Long-term', startDate: '2024-06-01' },
  { id: 'g12', garageNo: 'G-12', ownerName: 'Mr. Tapan Saha', mobileNumber: '9845001122', vehicleNumber: 'WB 01 WX 5432', vehicleType: 'Truck', monthlyRent: 8000, paymentStatus: 'Paid', currentDue: 0, leaseEndDate: '2030-06-30', leaseType: 'Long-term', startDate: '2024-06-15' },
];

export const seedPayments: Payment[] = [
  { id: 'p1', date: '2026-06-10', name: 'Mr. Roy (S-01)', type: 'Shop', amount: 5000, reference: 'PAY-001' },
  { id: 'p2', date: '2026-06-10', name: 'Rahul Das (G-02)', type: 'Garage', amount: 3000, reference: 'PAY-002' },
  { id: 'p3', date: '2026-06-10', name: 'Mr. Khan (S-03)', type: 'Shop', amount: 6000, reference: 'PAY-003' },
  { id: 'p4', date: '2026-06-09', name: 'Pradip Mondal (G-05)', type: 'Garage', amount: 3000, reference: 'PAY-004' },
  { id: 'p5', date: '2026-06-09', name: 'Mr. Paul (S-05)', type: 'Shop', amount: 5000, reference: 'PAY-005' },
];

export const seedBackups: BackupRecord[] = [
  { id: 'b1', name: 'Backup_10_06_2026_11_30_AM', description: 'Manual backup on 10 June 2026', type: 'Full Backup', createdAt: '10-Jun-2026 11:30 AM', size: '25.4 MB', createdBy: 'Admin' },
  { id: 'b2', name: 'Backup_09_06_2026_11_00_PM', description: 'Daily automated backup', type: 'Full Backup', createdAt: '09-Jun-2026 11:00 PM', size: '24.8 MB', createdBy: 'System' },
  { id: 'b3', name: 'Backup_08_06_2026_11_00_PM', description: 'Daily automated backup', type: 'Full Backup', createdAt: '08-Jun-2026 11:00 PM', size: '24.1 MB', createdBy: 'System' },
  { id: 'b4', name: 'Backup_07_06_2026_11_00_PM', description: 'Daily automated backup', type: 'Full Backup', createdAt: '07-Jun-2026 11:00 PM', size: '23.7 MB', createdBy: 'System' },
  { id: 'b5', name: 'Backup_06_06_2026_11_00_PM', description: 'Daily automated backup', type: 'Full Backup', createdAt: '06-Jun-2026 11:00 PM', size: '23.2 MB', createdBy: 'System' },
  { id: 'b6', name: 'Backup_05_06_2026_11_00_PM', description: 'Daily automated backup', type: 'Full Backup', createdAt: '05-Jun-2026 11:00 PM', size: '22.8 MB', createdBy: 'System' },
  { id: 'b7', name: 'Backup_04_06_2026_11_00_PM', description: 'Daily automated backup', type: 'Full Backup', createdAt: '04-Jun-2026 11:00 PM', size: '22.1 MB', createdBy: 'System' },
  { id: 'b8', name: 'Backup_03_06_2026_11_00_PM', description: 'Daily automated backup', type: 'Full Backup', createdAt: '03-Jun-2026 11:00 PM', size: '21.5 MB', createdBy: 'System' },
  { id: 'b9', name: 'Backup_02_06_2026_11_00_PM', description: 'Daily automated backup', type: 'Full Backup', createdAt: '02-Jun-2026 11:00 PM', size: '21.0 MB', createdBy: 'System' },
  { id: 'b10', name: 'Backup_01_06_2026_11_00_PM', description: 'Daily automated backup', type: 'Full Backup', createdAt: '01-Jun-2026 11:00 PM', size: '20.6 MB', createdBy: 'System' },
];
