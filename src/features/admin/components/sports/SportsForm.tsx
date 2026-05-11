import React, { useEffect, useState, useRef } from "react";
import {
    useForm,
    useFieldArray,
    type UseFormRegister,
    type FieldErrors,
    type UseFormSetValue,
    type UseFormWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Save, X, ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
    sportFormSchema,
    type SportFormValues,
} from "../../schemas/sportsSchema";
import type { SportResponse } from "../../types/sports";

type RuleInputType = "SELECT" | "MULTI_SELECT" | "NUMBER" | "TEXT";

interface RuleOption {
    label: string;
    value: string;
}

interface RuleConfig {
    type: RuleInputType;
    label: string;
    placeholder?: string;
    options?: RuleOption[];
}

const RULE_CONFIGS: Record<string, RuleConfig> = {
    CLOCK_TYPE: {
        label: "Loại đồng hồ",
        type: "SELECT",
        options: [
            { label: "Đếm tiến liên tục (Bóng đá...)", value: "COUNT_UP" },
            {
                label: "Đếm lùi (Bóng rổ, Futsal, Võ thuật...)",
                value: "COUNT_DOWN",
            },
            {
                label: "Không dùng đồng hồ / Tính theo Set (Cầu lông, Bóng bàn...)",
                value: "SET_BASED",
            },
        ],
    },
    PERIODS: {
        label: "Số hiệp / Số Set tối đa",
        type: "NUMBER",
        placeholder: "VD: 2 (Bóng đá), 4 (Bóng rổ), 3 (Cầu lông)",
    },
    PERIOD_DURATION: {
        label: "Thời gian mỗi hiệp - Phút",
        type: "NUMBER",
        placeholder: "VD: 45 (Bóng đá), 10 (Bóng rổ)",
    },
    OVERTIME_ALLOWED: {
        label: "Cho phép hiệp phụ / Tie-break",
        type: "SELECT",
        options: [
            { label: "Có cho phép", value: "YES" },
            { label: "Không cho phép (Chấp nhận Hòa)", value: "NO" },
        ],
    },

    // NHÓM ĐIỂM SỐ TRONG TRẬN
    POINTS_TO_WIN_SET: {
        label: "Điểm để thắng 1 Set",
        type: "NUMBER",
        placeholder: "VD: 21 (Cầu lông), 25 (Bóng chuyền)",
    },
    WIN_BY_TWO_RULE: {
        label: "Luật cách biệt 2 điểm",
        type: "SELECT",
        options: [
            {
                label: "Bắt buộc cách 2 điểm (Cầu lông, Bóng bàn...)",
                value: "YES",
            },
            { label: "Chạm mốc là thắng", value: "NO" },
        ],
    },
    MAX_POINTS_PER_SET: {
        label: "Điểm trần",
        type: "NUMBER",
        placeholder: "VD: 30 (Cầu lông). Chạm mốc này là thắng luôn.",
    },

    // NHÓM TÍNH ĐIỂM TRÊN BẢNG XẾP HẠNG
    WIN_POINTS: {
        label: "Điểm xếp hạng khi THẮNG",
        type: "NUMBER",
        placeholder: "VD: 3 (Bóng đá), 2 (Bóng rổ)",
    },
    DRAW_POINTS: {
        label: "Điểm xếp hạng khi HÒA",
        type: "NUMBER",
        placeholder: "VD: 1",
    },
    LOSE_POINTS: {
        label: "Điểm xếp hạng khi THUA",
        type: "NUMBER",
        placeholder: "VD: 0 (Bóng đá), 1 (Bóng rổ - thua vẫn có 1 điểm)",
    },

    MAX_STARTING_PLAYERS: {
        label: "Số VĐV thi đấu tối đa trên sân",
        type: "NUMBER",
        placeholder: "VD: 11 (Bóng đá), 5 (Bóng rổ), 1 (Tennis đơn)",
    },
    MIN_STARTING_PLAYERS: {
        label: "Số VĐV tối thiểu để không bị xử thua",
        type: "NUMBER",
        placeholder: "VD: 7 (Bóng đá 11 người), 4 (Bóng rổ)",
    },
    MAX_SUBSTITUTES: {
        label: "Số VĐV dự bị tối đa đăng ký",
        type: "NUMBER",
        placeholder: "VD: 9 (Bóng đá)",
    },
    MAX_SUBSTITUTIONS: {
        label: "Số lượt thay người tối đa",
        type: "NUMBER",
        placeholder: "VD: 5 (Bóng đá)",
    },

    // 5. NHÓM LỖI & PHẠT
    MAX_FOULS_PER_PLAYER: {
        label: "Lỗi cá nhân tối đa bị truất quyền",
        type: "NUMBER",
        placeholder: "VD: 5 (Bóng rổ FIBA), 6 (NBA)",
    },
    MAX_TEAM_FOULS: {
        label: "Lỗi đồng đội tối đa trước khi bị phạt",
        type: "NUMBER",
        placeholder: "VD: 4 (Bóng rổ), 5 (Futsal)",
    },
    YELLOW_CARDS_TO_RED: {
        label: "Số thẻ vàng cộng dồn thành thẻ đỏ",
        type: "NUMBER",
        placeholder: "VD: 2",
    },

    // NHÓM SỰ KIỆN TRÊN SÂN
    ALLOWED_EVENTS: {
        label: "Sự kiện được phép",
        type: "MULTI_SELECT",
        options: [
            { label: "Ghi bàn / Ăn 1 điểm (+1)", value: "GOAL" },
            { label: "Ghi 2 điểm (+2)", value: "PT_2" },
            { label: "Ghi 3 điểm (+3)", value: "PT_3" },
            { label: "Phản lưới nhà", value: "OWN_GOAL" },
            { label: "Phạm lỗi cá nhân", value: "FOUL" },
            { label: "Thẻ vàng / Cảnh cáo", value: "YELLOW_CARD" },
            { label: "Thẻ đỏ / Đuổi khỏi sân", value: "RED_CARD" },
            { label: "Thay người", value: "SUBSTITUTION" },
            { label: "Hội ý (Timeout)", value: "TIMEOUT" },
            { label: "Chấn thương", value: "INJURY" },
            { label: "Dừng trận đấu / Challenge", value: "VAR_CHALLENGE" },
        ],
    },
};

const PREDEFINED_KEYS = Object.keys(RULE_CONFIGS);

// COMPONENT FORM CHÍNH
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
        setValue,
        watch,
        formState: { errors },
    } = useForm<SportFormValues>({
        resolver: zodResolver(sportFormSchema),
        defaultValues: {
            name: "",
            description: "",
            rules: [{ ruleKey: "", ruleValue: "", description: "" }],
        },
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rules",
    });

    useEffect(() => {
        if (initialData) {
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
            reset({
                name: "",
                description: "",
                rules: [{ ruleKey: "", ruleValue: "", description: "" }],
            });
        }
    }, [initialData, reset]);

    const isEditMode = Boolean(initialData);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 h-full"
        >
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-20">
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
                                <div className="w-[25%]">
                                    Giá trị{" "}
                                    <span className="text-red-500">*</span>
                                </div>
                                <div className="w-[35%]">Ghi chú</div>
                                <div className="w-[5%]"></div>
                            </div>
                        )}

                        {fields.map((field, index) => (
                            <RuleRow
                                key={field.id}
                                index={index}
                                register={register}
                                errors={errors}
                                remove={remove}
                                setValue={setValue}
                                watch={watch}
                            />
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                append({
                                    ruleKey: "",
                                    ruleValue: "",
                                    description: "",
                                })
                            }
                            className="mt-2"
                        >
                            <Plus size={16} className="mr-1" /> Thêm quy tắc
                        </Button>
                    </div>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-4 border-t border-gray-200 flex justify-end gap-3 mt-auto bg-white">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    <X size={16} className="mr-2" /> Hủy bỏ
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

// COMPONENT ROW VÀ RENDERER ĐỘNG
interface RuleRowProps {
    index: number;
    register: UseFormRegister<SportFormValues>;
    errors: FieldErrors<SportFormValues>;
    remove: (index: number) => void;
    setValue: UseFormSetValue<SportFormValues>;
    watch: UseFormWatch<SportFormValues>;
}

const RuleRow: React.FC<RuleRowProps> = ({
    index,
    register,
    errors,
    remove,
    setValue,
    watch,
}) => {
    const ruleKey = watch(`rules.${index}.ruleKey`);
    const ruleValue = watch(`rules.${index}.ruleValue`);

    const [isCustomMode, setIsCustomMode] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ruleKey && !PREDEFINED_KEYS.includes(ruleKey))
            setIsCustomMode(true);
        else if (PREDEFINED_KEYS.includes(ruleKey)) setIsCustomMode(false);
    }, [ruleKey]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setValue(`rules.${index}.ruleValue`, ""); // Reset value khi đổi Key
        if (val === "CUSTOM") {
            setIsCustomMode(true);
            setValue(`rules.${index}.ruleKey`, "", { shouldValidate: true });
        } else {
            setIsCustomMode(false);
            setValue(`rules.${index}.ruleKey`, val, { shouldValidate: true });
        }
    };

    const activeConfig = RULE_CONFIGS[ruleKey] || {
        type: "TEXT",
        placeholder: "Nhập giá trị...",
    };
    const ruleKeyRegister = register(`rules.${index}.ruleKey`);

    const dropdownKeyValue = isCustomMode
        ? "CUSTOM"
        : PREDEFINED_KEYS.includes(ruleKey)
          ? ruleKey
          : "";

    const handleMultiSelectToggle = (optionValue: string) => {
        const currentArr = ruleValue
            ? ruleValue.split(",").filter(Boolean)
            : [];
        const isSelected = currentArr.includes(optionValue);

        let newArr;
        if (isSelected) {
            newArr = currentArr.filter((v) => v !== optionValue); // Bỏ chọn
        } else {
            newArr = [...currentArr, optionValue]; // Thêm mới
        }

        setValue(`rules.${index}.ruleValue`, newArr.join(","), {
            shouldValidate: true,
        });
    };

    const multiSelectedArr = ruleValue
        ? ruleValue.split(",").filter(Boolean)
        : [];

    return (
        <div className="flex gap-3 items-start group relative">
            {/* CỘT 1: RULE KEY */}
            <div className="w-[35%] flex flex-col gap-2">
                <select
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-colors cursor-pointer ${
                        errors.rules?.[index]?.ruleKey
                            ? "border-red-500"
                            : "border-gray-300"
                    }`}
                    value={dropdownKeyValue}
                    onChange={handleKeyChange}
                >
                    <option value="" disabled>
                        -- Chọn quy tắc cốt lõi --
                    </option>
                    {Object.entries(RULE_CONFIGS).map(([key, config]) => (
                        <option key={key} value={key}>
                            {config.label}
                        </option>
                    ))}
                </select>

                {isCustomMode && (
                    <Input
                        placeholder="VD: DIEM_THANG_SET"
                        error={errors.rules?.[index]?.ruleKey?.message}
                        {...ruleKeyRegister}
                        onChange={(e) => {
                            e.target.value = e.target.value
                                .toUpperCase()
                                .replace(/\s/g, "_");
                            ruleKeyRegister.onChange(e);
                        }}
                    />
                )}
            </div>

            {/* CỘT 2: RULE VALUE */}
            <div className="w-[25%] relative" ref={dropdownRef}>
                {activeConfig.type === "SELECT" && (
                    <select
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        {...register(`rules.${index}.ruleValue`)}
                    >
                        <option value="" disabled>
                            -- Chọn --
                        </option>
                        {activeConfig.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                )}

                {activeConfig.type === "MULTI_SELECT" && (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white text-left flex items-center justify-between hover:border-gray-400"
                        >
                            <span className="truncate pr-2">
                                {multiSelectedArr.length > 0
                                    ? `Đã chọn (${multiSelectedArr.length})`
                                    : "Chọn sự kiện..."}
                            </span>
                            <ChevronDown
                                size={16}
                                className="text-gray-500 shrink-0"
                            />
                        </button>

                        {/* Dropdown Options */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-xl rounded-lg z-50 max-h-60 overflow-y-auto py-1 w-max min-w-full">
                                {activeConfig.options?.map((opt) => {
                                    const isSelected =
                                        multiSelectedArr.includes(opt.value);
                                    return (
                                        <div
                                            key={opt.value}
                                            onClick={() =>
                                                handleMultiSelectToggle(
                                                    opt.value,
                                                )
                                            }
                                            className="px-3 py-2.5 flex items-center gap-3 hover:bg-blue-50 cursor-pointer transition-colors"
                                        >
                                            <div
                                                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}
                                            >
                                                {isSelected && (
                                                    <Check
                                                        size={12}
                                                        className="text-white"
                                                    />
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-700 whitespace-nowrap">
                                                {opt.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <input
                            type="hidden"
                            {...register(`rules.${index}.ruleValue`)}
                        />
                    </div>
                )}

                {activeConfig.type === "NUMBER" && (
                    <Input
                        type="number"
                        placeholder={activeConfig.placeholder}
                        error={errors.rules?.[index]?.ruleValue?.message}
                        {...register(`rules.${index}.ruleValue`)}
                    />
                )}

                {activeConfig.type === "TEXT" && (
                    <Input
                        placeholder={activeConfig.placeholder}
                        error={errors.rules?.[index]?.ruleValue?.message}
                        {...register(`rules.${index}.ruleValue`)}
                    />
                )}
            </div>

            <div className="w-[35%]">
                <Input
                    placeholder="Ghi chú (Tùy chọn)"
                    {...register(`rules.${index}.description`)}
                />
            </div>

            <button
                type="button"
                onClick={() => remove(index)}
                className="w-[5%] h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors mt-1"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
};
