export default function BlogSection() {
  return (
    <section className="lg:py-16 md:py-5 py-2.5 xl:px-10 lg:px-2.5 px-2.5 ">
      <div className="container mx-auto text-center">
        
        <div className="flex  items-center justify-center">
          
           <img
              src="/assets/landing/blogs/1.png"
              alt="blog"
              className=" object-fit w-full"
            />
        

         
        </div>

        {/* Text Content */}
        <div className="xl:-mt-80 lg:-mt-52 md:-mt-36 ">
          <span className="bg-[#E31E24] text-white px-6 py-3 rounded-full lg:text-lg text-sm font-medium">
            Our Blogs / News
          </span>
          <h2 className="mt-4 lg:text-3xl text-2xl  font-michroma leading-13">
            Market Insights & <br /> Traing Stories
          </h2>
          <p className="mt-4 max-w-2xl lg:text-lg text-sm  mx-auto">
            Stay updated with the latest trends, expert analysis, and
            market-moving news. Your daily dose of clarity and confidence in the
            ever-changing world of trading.
          </p>
        </div>
      </div>
    </section>
  );
}
