import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full h-full">
        {/* Left Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Top Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-6 w-6" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            {/* Main Content Area */}
            <Card className="flex-grow">
                 <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[250px] w-full" />
                </CardContent>
            </Card>
        </div>

        {/* Right Section - Map */}
        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card className="flex-grow h-[400px] lg:h-auto">
                <CardContent className="p-0 h-full">
                    <Skeleton className="h-full w-full rounded-lg" />
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
