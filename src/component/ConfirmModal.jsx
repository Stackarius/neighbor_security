'use client';

import { Dialog } from '@headlessui/react';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-xl">
                    <Dialog.Title className="text-lg font-bold">Confirm Delete</Dialog.Title>
                    <Dialog.Description className="mt-2 text-sm text-gray-500">
                        Are you sure you want to delete this report? This action cannot be undone.
                    </Dialog.Description>
                    <div className="mt-4 flex justify-end space-x-2">
                        <button onClick={onClose} className="rounded bg-gray-200 px-4 py-2 text-sm">Cancel</button>
                        <button onClick={onConfirm} className="rounded bg-red-600 px-4 py-2 text-sm text-white">Delete</button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
