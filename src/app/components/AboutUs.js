import React from 'react';

const AboutPage = () => {
  return (
    <div className="about-page bg-blue-100 py-10">
      <div className="container mx-auto px-4">
        
        {/* Introduction Section */}
        <section className="intro text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">About Us</h1>
          <p className="text-lg text-gray-700">
            Welcome to [Your Company Name], where we [briefly describe what you do]. Our goal is to [briefly describe your goals or mission].
          </p>
        </section>

        {/* Mission and Vision Section */}
        <section className="mission-vision mb-12">
          <div className="flex flex-col md:flex-row md:justify-between">
            
            {/* Mission Section */}
            <div className="w-full md:w-1/2 mb-6 md:mb-0 px-4">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Our Mission</h2>
              <p className="text-gray-700 mb-6">
                Our mission is to [describe your mission]. We strive to [explain how you achieve this mission].
              </p>
              <div className=" bg-blue-50 hover:bg-blue-200 transparent: 'transparent' p-6 rounded-lg shadow-xl text-center">
                <img
                  src="https://picsum.photos/200/300/?blur"
                  alt="Mission Image"
                  className="w-64 h-64 object-cover rounded-lg mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2 text-black">John Doe</h3>
                <p className="text-gray-600">CEO & Founder</p>
                <p className="mt-2 text-black">John is the visionary behind our company, leading with passion and innovation.</p>
              </div>
            </div>
            
            {/* Vision Section */}
            <div className="w-full md:w-1/2 px-4">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Our Vision</h2>
              <p className="text-gray-700 mb-6">
                Our vision is to [describe your vision]. We envision a future where [describe the impact you hope to have].
              </p>
              <div className="bg-blue-50 hover:bg-blue-200 transparent: 'transparent' p-6 rounded-lg shadow-xl text-center">
                <img
                  src="https://picsum.photos/200/300"
                  alt="Vision Image"
                  className="w-64 h-64 object-cover rounded-lg mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2 text-black">Jane Doe</h3>
                <p className="text-black">Visionary Leader</p>
                <p className="mt-2 text-black">Jane is committed to shaping the future with innovative solutions and forward-thinking strategies.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="team mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Meet the Team</h2>
          <div className="flex flex-wrap -mx-4">
            {/* Team Member 2 */}
            <div className="w-full md:w-1/3 px-4 mb-6">
              <div className="bg-blue-50 hover:bg-blue-200 transparent: 'transparent' p-6 rounded-lg shadow-xl text-center">
                <img src="https://picsum.photos/seed/picsum/200/300" alt="Team Member" className="w-32 h-32 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-black">Jane Smith</h3>
                <p className="text-gray-600">CTO</p>
                <p className="mt-2 text-black">Jane drives our technology and innovation efforts, ensuring we stay ahead in the industry.</p>
              </div>
            </div>
            {/* Team Member 3 */}
            <div className="w-full md:w-1/3 px-4 mb-6">
              <div className="bg-blue-50 hover:bg-blue-200 transparent: 'transparent' p-6 rounded-lg shadow-xl text-center">
                <img src="https://picsum.photos/200/300" alt="Team Member" className="w-32 h-32 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-black">Emily Johnson</h3>
                <p className="text-gray-600">COO</p>
                <p className="mt-2 text-black">Emily ensures our operations run smoothly and efficiently, making sure our company meets its goals.</p>
              </div>
            </div>
            {/* Team Member 3 */}
            <div className="w-full md:w-1/3 px-4 mb-6">
              <div className="bg-blue-50 hover:bg-blue-200 transparent: 'transparent' p-6 rounded-lg shadow-xl text-center">
                <img src="https://picsum.photos/200/300" alt="Team Member" className="w-32 h-32 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-black">Emily Johnson</h3>
                <p className="text-gray-600 ">COO</p>
                <p className="mt-2 text-black">Emily ensures our operations run smoothly and efficiently, making sure our company meets its goals.</p>
              </div>
            </div>
            {/* Add more team members similarly */}
          </div>
        </section>

        {/* History Section */}
        <section className="history mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Our History</h2>
          <p className="text-gray-700">
            [Describe the history of your company, including significant milestones and achievements.]
          </p>
        </section>

        {/* Achievements Section */}

        {/* Contact Information Section */}

      </div>
    </div>
  );
};

export default AboutPage;
