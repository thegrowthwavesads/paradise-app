import React from 'react';
import { Loader2 } from 'lucide-react';

const CustomersList = ({ customers, bookings, loading }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCustomerBookingsCount = (email) => {
    return bookings.filter(b => b.customerEmail === email).length;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <Loader2 className="animate-spin mx-auto mb-4" size={48} style={{color: '#eb3030'}} />
        <p className="text-gray-500">Loading customers...</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-gray-500 text-lg">No customers yet</p>
        <p className="text-gray-400 text-sm mt-2">Customers will appear here when they sign up</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Bookings
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map(customer => (
              <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{customer.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(customer.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                    {getCustomerBookingsCount(customer.email)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersList;
