import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Pagination({
    page,
    totalPages,
    pageLink,
}: {
    page: number;
    totalPages: number;
    pageLink: (targetPage: number) => string;
}) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-8 flex items-center justify-center gap-3 sm:mt-10 sm:gap-4">
            <Button
                disabled={page <= 1}
                render={page <= 1 ? undefined : <Link href={pageLink(page - 1)} />}
                variant="outline"
                className="h-auto flex-1 rounded-lg px-4 py-2.5 text-sm font-medium sm:flex-none sm:py-2"
            >
                &larr; Sebelumnya
            </Button>
            <span className="shrink-0 text-xs text-gray-600 sm:text-sm">
                {page} / {totalPages}
            </span>
            <Button
                disabled={page >= totalPages}
                render={page >= totalPages ? undefined : <Link href={pageLink(page + 1)} />}
                variant="outline"
                className="h-auto flex-1 rounded-lg px-4 py-2.5 text-sm font-medium sm:flex-none sm:py-2"
            >
                Berikutnya &rarr;
            </Button>
        </div>
    );
}
