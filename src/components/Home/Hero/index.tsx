import CountdownTimer from "./CountdownTimer";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";

const Hero = ({ products }: { products: any[] }) => {
  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              {/* <!-- bg shapes --> */}
              <Image
                src={"/images/hero/hero-bg.png"}
                alt=""
                className="absolute right-0 bottom-0 -z-10"
                width={534}
                height={520}
                priority
              />

              <div className="h-[500px]">
                <HeroCarousel products={products} />
              </div>
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5 ">
              {products.slice(0, 2).map((product, index) => (
                <div 
                key={index}
                className="w-full relative rounded-[10px] p-4 sm:p-7.5 bg-white overflow-hidden">
                <div className="flex items-center gap-14">
                  <div>
                    <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-11">
                      <a href="#"> {product?.name || "Wireless Headphone"} </a>
                    </h2>
                    <CountdownTimer />
                    <div>
                      <p className="font-medium text-dark-2 text-custom-sm mb-1.5">
                        limited time offer
                      </p>
                      <span className="flex items-center gap-3">
                        <span className="font-medium text-heading-5 text-red">
                          ${product.productVariants[0]?.price || "499"}
                        </span>
                        <span className="font-medium text-xl text-dark-4 line-through">
                          $999
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <Image
                      src={product?.thumbnail || "/images/hero/hero-02.png"}
                      alt="mobile image"
                      width={123}
                      height={161}
                      loading="lazy"
                      sizes="(max-width: 640px) 80px, 123px"
                    />
                  </div>
                </div>
              </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Hero features --> */}
      <HeroFeature />
    </section>
  );
};

export default Hero;
