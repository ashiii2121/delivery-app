import React from "react";

const CartSidebar = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
}) => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const deliveryFee = 30;
  const total = subtotal + deliveryFee;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">Your Cart</h2>
                <button
                  onClick={onClose}
                  className="ml-3 h-7 flex items-center justify-center"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <div className="mt-8">
                <div className="flow-root">
                  {cartItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Your cart is empty
                    </p>
                  ) : (
                    <ul className="-my-6 divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <li key={item._id} className="py-6 flex">
                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.name}</h3>
                                <p className="ml-4">₹{item.price * item.qty}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                Qty: {item.qty}
                              </p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <div className="flex items-center">
                                <button
                                  onClick={() =>
                                    onUpdateQuantity(
                                      item._id,
                                      Math.max(1, item.qty - 1)
                                    )
                                  }
                                  className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                                >
                                  -
                                </button>
                                <span className="mx-2">{item.qty}</span>
                                <button
                                  onClick={() =>
                                    onUpdateQuantity(item._id, item.qty + 1)
                                  }
                                  className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                onClick={() => onRemoveItem(item._id)}
                                type="button"
                                className="font-medium text-red-600 hover:text-red-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>₹{subtotal}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 mt-2">
                  <p>Delivery Fee</p>
                  <p>₹{deliveryFee}</p>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 mt-4">
                  <p>Total</p>
                  <p>₹{total}</p>
                </div>
                <div className="mt-6">
                  <button className="w-full bg-red-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-red-700 focus:outline-none">
                    Checkout
                  </button>
                </div>
                <div className="mt-4 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    or{" "}
                    <button
                      type="button"
                      className="text-red-600 font-medium hover:text-red-500"
                      onClick={onClose}
                    >
                      Continue Shopping<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
