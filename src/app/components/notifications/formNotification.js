import React from 'react'

const AlertNotification = ({ message, status }) => {
    if (!message) return null;

    let bgColor = '';
    let textColor = '';

    switch (status) {
        case 200:
        case 201:
            bgColor = 'bg-green-500';
            textColor = 'text-white';
        break;
        case 400:
            bgColor = 'bg-red-600';
            textColor = 'text-white';
        break;
        case 401:
        case 403:
            bgColor = 'bg-red-600';
            textColor = 'text-white';
        break;
        case 500:
            bgColor = 'bg-red-600';
            textColor = 'text-white';
        break;
        default:
            bgColor = 'bg-gray-500';
            textColor = 'text-white';
    }
  return (
    <div className={`w-full px-4 py-2 rounded-lg text-center ${bgColor} ${textColor}`}>
      {message}
    </div>
  )
}

export default AlertNotification