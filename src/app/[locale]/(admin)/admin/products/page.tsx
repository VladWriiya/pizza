'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import toast from 'react-hot-toast';
import { Product } from '@prisma/client';


import { Button, Skeleton } from '@/shared/ui';
import { Heading } from '@/shared/Heading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { AlertDialogHeader, AlertDialogFooter } from '@/shared/ui/alert-dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@radix-ui/react-alert-dialog';
import { deleteProductAction } from '@/features/product/actions/delete-product.action';
import { getProductsAction } from '@/features/product/actions/product.queries';


export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchProducts = () => {
    setLoading(true);
    getProductsAction().then(data => {
      setProducts(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  
  const onDelete = (id: number) => {
    startTransition(async () => {
      try {
        await deleteProductAction(id);
        toast.success('Product deleted successfully!');
        fetchProducts();
      } catch {
        toast.error('Failed to delete product.');
      }
    });
  };

  if (loading && products.length === 0) {
    return (
        <div>
            <div className="pz-flex pz-items-center pz-justify-between pz-mb-8">
                <Skeleton className="pz-w-48 pz-h-10" />
                <Skeleton className="pz-w-32 pz-h-10" />
            </div>
            <div className="pz-space-y-4">
                <Skeleton className="pz-w-full pz-h-16" />
                <Skeleton className="pz-w-full pz-h-16" />
                <Skeleton className="pz-w-full pz-h-16" />
            </div>
        </div>
    );
  }

  return (
    <div>
      <div className="pz-flex pz-items-center pz-justify-between">
        <Heading level="1">Products ({products.length})</Heading>
        <Button onClick={() => router.push('/admin/products/add')}>
          Add Product
        </Button>
      </div>

      <Table className="pz-mt-8">
        <TableHeader>
          <TableRow>
            <TableHead className="pz-w-[100px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="pz-text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <img src={product.imageUrl} alt={product.name} width={50} height={50} className="pz-rounded-md pz-object-cover"/>
              </TableCell>
              <TableCell className="pz-font-medium">{product.name}</TableCell>
              <TableCell className="pz-text-right pz-space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                >
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the product.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(product.id)} disabled={isPending}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}