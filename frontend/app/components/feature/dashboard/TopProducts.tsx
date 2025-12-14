import type { TopProduct } from "~/types/analytic";

interface TopProductsProps {
    products: TopProduct[] | undefined;
}

export default function TopProducts({ products }: TopProductsProps) {
    if (!products || products.length === 0) {
        return (
            <div className="h-full">
                <div className="flex items-center justify-center h-40 text-gray-500">
                    No data available
                </div>
            </div>
        );
    }

    return (
        <div className="h-full">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Out</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Txns</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.product_name}</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{product.total_moved}</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-green-600">+{product.total_moved_inbound}</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-red-600">-{product.total_moved_outbound}</td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{product.transaction_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
