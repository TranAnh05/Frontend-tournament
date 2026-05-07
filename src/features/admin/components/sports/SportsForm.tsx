import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Save, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
    sportFormSchema,
    type SportFormValues,
} from "../../schemas/sportsSchema";
import type { SportResponse } from "../../types/sports";

interface SportsFormProps {
    initialData?: SportResponse | null;
    onSubmit: (data: SportFormValues) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const SportsForm: React.FC<SportsFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SportFormValues>({
        resolver: zodResolver(sportFormSchema),
        defaultValues: {
            name: "",
            description: "",
            rules: [{ ruleKey: '', ruleValue: '', description: '' }],
        },
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rules",
    });

    // BƠM DỮ LIỆU VÀO FORM
    useEffect(() => {
        if (initialData) {
            // Chế độ Edit: Map dữ liệu từ Backend trả về khớp với cấu trúc Form
            reset({
                name: initialData.name,
                description: initialData.description || "",
                rules: initialData.rules.map((rule) => ({
                    id: rule.id,
                    ruleKey: rule.ruleKey,
                    ruleValue: rule.ruleValue,
                    description: rule.description || "",
                })),
            });
        } else {
            // Chế độ Create: Nếu Drawer bị đóng rồi mở lại để thêm mới, làm sạch form
            reset({
                name: "",
                description: "",
                rules: [{ ruleKey: '', ruleValue: '', description: '' }],
            });
        }
    }, [initialData, reset]);

    const handleAddRule = () => {
        append({ ruleKey: "", ruleValue: "", description: "" });
    };

    const isEditMode = Boolean(initialData);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 h-full"
        >
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                {/* THÔNG TIN CƠ BẢN */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                        Thông tin cơ bản
                    </h3>
                    <div className="space-y-4">
                        <Input
                            label="Tên môn thể thao"
                            required
                            placeholder="VD: Bóng rổ 5x5"
                            error={errors.name?.message}
                            {...register("name")}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mô tả chi tiết
                            </label>
                            <textarea
                                {...register("description")}
                                rows={3}
                                placeholder="Nhập mô tả về môn thể thao này..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* CẤU HÌNH LUẬT THI ĐẤU */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-900">
                            Bộ quy tắc & Thông số
                        </h3>
                        <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                            {fields.length} quy tắc
                        </span>
                    </div>

                    <div className="space-y-3">
                        {fields.length > 0 && (
                            <div className="flex gap-3 px-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="w-[35%]">
                                    Mã quy tắc (Key){" "}
                                    <span className="text-red-500">*</span>
                                </div>
                                <div className="w-[20%]">
                                    Giá trị{" "}
                                    <span className="text-red-500">*</span>
                                </div>
                                <div className="w-[40%]">Ghi chú</div>
                                <div className="w-[5%]"></div>
                            </div>
                        )}

                        {fields.map((field, index) => {
                            const ruleKeyRegister = register(
                                `rules.${index}.ruleKey`,
                            );

                            return (
                                <div
                                    key={field.id}
                                    className="flex gap-3 items-start group"
                                >
                                    <div className="w-[35%]">
                                        <Input
                                            placeholder="VD: DIEM_THANG"
                                            error={
                                                errors.rules?.[index]?.ruleKey
                                                    ?.message
                                            }
                                            {...ruleKeyRegister}
                                            onChange={(e) => {
                                                e.target.value = e.target.value
                                                    .toUpperCase()
                                                    .replace(/\s/g, "_");
                                                ruleKeyRegister.onChange(e);
                                            }}
                                        />
                                    </div>

                                    <div className="w-[20%]">
                                        <Input
                                            placeholder="VD: 3"
                                            error={
                                                errors.rules?.[index]?.ruleValue
                                                    ?.message
                                            }
                                            {...register(
                                                `rules.${index}.ruleValue`,
                                            )}
                                        />
                                    </div>

                                    <div className="w-[40%]">
                                        <Input
                                            placeholder="VD: Điểm khi thắng"
                                            {...register(
                                                `rules.${index}.description`,
                                            )}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="w-[5%] h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors mt-0"
                                        title="Xóa quy tắc này"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            );
                        })}

                        {fields.length === 0 && (
                            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                                <p className="text-sm text-gray-500">
                                    Chưa có quy tắc nào được thiết lập.
                                </p>
                            </div>
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddRule}
                            className="mt-2"
                        >
                            <Plus size={16} className="mr-1" />
                            Thêm quy tắc
                        </Button>
                    </div>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-4 border-t border-gray-200 flex justify-end gap-3 mt-auto">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    <X size={16} className="mr-2" />
                    Hủy bỏ
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                >
                    {!isSubmitting && <Save size={16} className="mr-2" />}
                    {isEditMode ? "Lưu thay đổi" : "Lưu môn thể thao"}
                </Button>
            </div>
        </form>
    );
};
