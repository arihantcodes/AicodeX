import { Tier } from '@/constants/pricing-tier';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  loading: boolean;
  tier: Tier;
  priceMap: Record<string, string>;
  value: 'month' | 'year';
  priceSuffix: string;
}

export function PriceAmount({ loading, priceMap, priceSuffix, tier, value }: Props) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getPrice = () => {
    if (tier.priceId?.[value] && priceMap[tier.priceId?.[value]]) {
      return priceMap[tier.price ?? '']?.replace(/\.00$/, '') ?? '';
    }
    return formatPrice(tier.price);
  };

  return (
    <div className="mt-6 flex flex-col px-8">
      {loading ? (
        <Skeleton className="h-[96px] w-full bg-border" />
      ) : (
        <>
          <div 
            className={cn('text-[80px] leading-[96px] tracking-[-1.6px] font-medium')}
            aria-label={`Price: ${getPrice()}`}
          >
            {getPrice()}
          </div>
          <div className={cn('font-medium leading-[12px] text-[12px]')}>{priceSuffix}</div>
        </>
      )}
    </div>
  );
}