import { AthleteRegisterForm } from '../components/AthleteRegisterForm';

const AthleteRegisterPage = () => {
  return (
    <div className="min-h-screen flex w-full bg-white flex-row-reverse">

      {/* CỘT PHẢI */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
        <div className="w-full max-w-md z-10 flex flex-col justify-center h-full">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-14 w-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-600/30">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Tạo tài khoản VĐV
            </h1>
            <p className="mt-3 text-sm text-gray-500 font-medium">
              Gia nhập hệ sinh thái Tournament Hub ngay hôm nay
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <AthleteRegisterForm />
          </div>
        </div>
      </div>

      {/* CỘT TRÁI: Banner */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-700">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10" />
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-overlay"
          src="https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Sports Registration Background"
        />
        <div className="absolute bottom-20 left-16 right-16 z-20 text-white space-y-4">
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-sm font-semibold rounded-full border border-white/20 mb-2">
            Bứt phá giới hạn
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            Nơi những nhà vô địch <br/>
            <span className="text-blue-400">bắt đầu.</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-md leading-relaxed font-light">
            Quản lý đội tuyển, đăng ký thi đấu và theo dõi thành tích chuyên nghiệp chưa bao giờ dễ dàng đến thế.
          </p>
        </div>
      </div>

    </div>
  );
};

export default AthleteRegisterPage;