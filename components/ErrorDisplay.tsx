
import React from 'react';
import { ExclamationTriangleIcon } from './icons';

interface ErrorDisplayProps {
    message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
    return (
        <div className="flex items-center gap-4 p-4 bg-red-900/50 border border-red-500/50 text-red-300 rounded-lg">
            <ExclamationTriangleIcon className="w-8 h-8 flex-shrink-0" />
            <div>
                <h4 className="font-bold">An Error Occurred</h4>
                <p>{message}</p>
            </div>
        </div>
    );
};
