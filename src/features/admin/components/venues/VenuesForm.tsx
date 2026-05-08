/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Save, X, MapPin, Layers } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
    venueFormSchema,
    type VenueFormValues,
} from "../../schemas/venuesSchema";
import { type VenueResponse } from "../../types/venues";
import { useGetSports } from "../../hooks/sports/useGetSports";
import { cn } from "@/utils/classNames";

interface VenuesFormProps {
    initialData?: VenueResponse | null;
    onSubmit: (data: VenueFormValues) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const VenuesForm: React.FC<VenuesFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) => {
    const { data: sportsData, fetchSports } = useGetSports();

    useEffect(() => {
        fetchSports({ status: "ACTIVE", size: 100 });
    }, [fetchSports]);

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<VenueFormValues>({
        resolver: zodResolver(venueFormSchema),
        defaultValues: {
            name: "",
            address: "",
            courts: [
                { courtName: "", status: "ACTIVE", supportedSportIds: [] },
            ],
        },
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "courts",
    });

    // Đổ dữ liệu khi ở chế độ Edit
    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name,
                address: initialData.address,
                courts: initialData.courts.map((court) => ({
                    id: court.id,
                    courtName: court.courtName,
                    status: court.status,
                    supportedSportIds: court.supportedSports.map(
                        (sport) => sport.id,
                    ),
                })),
            });
        } else {
            reset({
                name: "",
                address: "",
                courts: [
                    { courtName: "", status: "ACTIVE", supportedSportIds: [] },
                ],
            });
        }
    }, [initialData, reset]);

    const isEditMode = Boolean(initialData);

    const onError = (errors: any) => {
        console.log("Lỗi Validation bị ẩn:", errors);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="flex flex-col h-full gap-6"
        >
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                {/* THÔNG TIN ĐỊA ĐIỂM  */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin size={18} className="text-blue-500" /> Thông tin
                        khu vực
                    </h3>
                    <div className="space-y-4">
                        <Input
                            label="Tên địa điểm"
                            required
                            placeholder="VD: Nhà thi đấu GDU"
                            error={errors.name?.message}
                            {...register("name")}
                        />
                        <Input
                            label="Địa chỉ cụ thể"
                            required
                            placeholder="Nhập địa chỉ đầy đủ..."
                            error={errors.address?.message}
                            {...register("address")}
                        />
                    </div>
                </div>

                {/* QUẢN LÝ SÂN THI ĐẤU  */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            <Layers size={18} className="text-blue-500" /> Danh
                            sách sân thi đấu
                        </h3>
                        <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                            {fields.length} sân
                        </span>
                    </div>

                    {errors.courts?.root?.message && (
                        <p className="text-sm text-red-500 mb-4">
                            {errors.courts.root.message}
                        </p>
                    )}

                    <div className="space-y-5">
                        {fields.map((field, index) => {
                            // mảng ID môn thể thao của sân hiện tại
                            const currentSportIds =
                                watch(`courts.${index}.supportedSportIds`) ||
                                [];

                            // Hàm xử lý khi click vào 1 thẻ môn thể thao
                            const toggleSportSelection = (sportId: number) => {
                                const isSelected =
                                    currentSportIds.includes(sportId);
                                const newSelection = isSelected
                                    ? currentSportIds.filter(
                                          (id) => id !== sportId,
                                      )
                                    : [...currentSportIds, sportId];

                                // Set lại giá trị vào Form, kích hoạt validate
                                setValue(
                                    `courts.${index}.supportedSportIds`,
                                    newSelection,
                                    {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    },
                                );
                            };

                            return (
                                <div
                                    key={field.id}
                                    className="p-4 bg-gray-50 border border-gray-200 rounded-lg relative group"
                                >
                                    {watch(`courts.${index}.id`) && (
                                        <input
                                            type="hidden"
                                            {...register(
                                                `courts.${index}.id` as const,
                                                { valueAsNumber: true },
                                            )}
                                        />
                                    )}

                                    {/* Nút xóa sân */}
                                    {fields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Xóa sân này"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                                        {/* Tên sân */}
                                        <Input
                                            label="Tên sân con"
                                            required
                                            placeholder="VD: Sân số 1, Sân A..."
                                            error={
                                                errors.courts?.[index]
                                                    ?.courtName?.message
                                            }
                                            {...register(
                                                `courts.${index}.courtName`,
                                            )}
                                        />

                                        {/* Trạng thái sân */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Trạng thái sân
                                            </label>
                                            <select
                                                {...register(
                                                    `courts.${index}.status`,
                                                )}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            >
                                                <option value="ACTIVE">
                                                    Sẵn sàng hoạt động
                                                </option>
                                                <option value="MAINTENANCE">
                                                    Đang bảo trì
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Vùng chọn Môn thể thao */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Môn thể thao hỗ trợ trên sân này{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {sportsData.content.map((sport) => {
                                                const isSelected =
                                                    currentSportIds.includes(
                                                        sport.id,
                                                    );
                                                return (
                                                    <button
                                                        key={sport.id}
                                                        type="button"
                                                        onClick={() =>
                                                            toggleSportSelection(
                                                                sport.id,
                                                            )
                                                        }
                                                        className={cn(
                                                            "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                                                            isSelected
                                                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100",
                                                        )}
                                                    >
                                                        {sport.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {/* Hiển thị lỗi nếu mảng ID rỗng */}
                                        {errors.courts?.[index]
                                            ?.supportedSportIds?.message && (
                                            <p className="mt-2 text-xs text-red-500">
                                                {
                                                    errors.courts[index]
                                                        .supportedSportIds
                                                        ?.message
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                append({
                                    courtName: "",
                                    status: "ACTIVE",
                                    supportedSportIds: [],
                                })
                            }
                        >
                            <Plus size={16} className="mr-1" />
                            Thêm sân mới
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- ACTION BUTTONS --- */}
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
                    {isEditMode ? "Lưu thay đổi" : "Tạo địa điểm"}
                </Button>
            </div>
        </form>
    );
};
