import React from 'react';

const partners = [
  { logo: '/assets/subway.jpg', name: 'Subway' },
  { logo: '/assets/starbucks.jpg', name: 'Starbucks' },
  { logo: '/assets/hothideout.jpg', name: 'Hot Hideout'},
  { logo: '/assets/jollibee.jpg', name: 'Jollibee' },
];

const HeroSection = () => {
  return (
    <section className="bg-white py-20 px-6 text-center">
      <h1 className="text-4xl fw-bold mb-4">Trusted by Our Partnering Merchants</h1>
      <p className="text-gray-700 text-lg mb-10 max-w-2xl mx-auto">
        A Few of Our Valued Partner Merchants      
      </p>

      <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 xxl:grid-cols-5 gap-4 max-w-6xl mx-auto px-2">
            {partners.map((partner, index) => (
                <div key={index} className="flex flex-col items-center justify-center">
                <div className="w-[120px] h-[100px] flex items-center justify-center">
                    <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain"
                    />
                </div>
                <div className="mt-2 text-center">
                    <h5 className="font-semibold">{partner.name}</h5>
                </div>
                </div>
            ))}
        </div>

        <div className="mt-12">
            <a
            href="/aboutUs"
            className="no-underline inline-block bg-blue-600 text-white px-3 py-3 rounded-lg hover:bg-blue-700 transition"
            >
            Find out more about us
            </a>
        </div>
    </section>
  );
}

export default HeroSection;