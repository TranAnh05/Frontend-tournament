import { LoginForm } from "../components/LoginForm";

const LoginPage = () => {
    return (
        <div className="min-h-screen flex w-full bg-white">
            {/* CỘT TRÁI: Khu vực chứa Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
                <div className="w-full max-w-md z-10 flex flex-col justify-center h-full">
                    {/* Header của Form */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            TOURNAMENT{" "}
                            <span className="text-blue-600">HUB</span>
                        </h1>
                        <p className="mt-3 text-sm text-gray-500 font-medium">
                            Hệ thống Quản lý Giải Thể thao Chuyên nghiệp
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                        <LoginForm />
                    </div>
                </div>
            </div>

            {/* CỘT PHẢI: Hình ảnh Banner */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-700">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-700/40 to-transparent z-10" />

                <img
                    className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-overlay"
                    src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="Sports Tournament Background"
                />

                {/* Slogan nằm đè lên hình ảnh */}
                <div className="absolute bottom-20 left-16 right-16 z-20 text-white space-y-4">
                    {/* Badge */}
                    <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-sm font-semibold rounded-full border border-white/20 mb-2">
                        Khởi tranh Mùa giải mới
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                        Đồng hành cùng <br />
                        <span className="text-blue-400">đam mê.</span>
                    </h2>

                    <p className="text-lg text-gray-300 max-w-md leading-relaxed font-light">
                        Kết nối Vận động viên, Ban tổ chức và Trọng tài trên một
                        nền tảng duy nhất. Nâng tầm trải nghiệm thể thao của
                        bạn.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
