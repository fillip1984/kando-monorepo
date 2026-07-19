import { BloodPressureCategoryEnumValues } from "@/client/enums"

export const determineCategory = (bpr: {
  systolic: number
  diastolic: number
}) => {
  if (bpr.systolic > 180 || bpr.diastolic > 120) {
    return BloodPressureCategoryEnumValues.HYPERTENSION_CRISIS // "Hypertensive Crisis"
  } else if (bpr.systolic >= 140 || bpr.diastolic >= 90) {
    return BloodPressureCategoryEnumValues.HYPERTENSION_2 // "Hypertension Stage 2"
  } else if (bpr.systolic >= 130) {
    return BloodPressureCategoryEnumValues.HYPERTENSION_1 // "Hypertension Stage 1"
  } else if (bpr.diastolic >= 80) {
    return BloodPressureCategoryEnumValues.HYPERTENSION_1 // "Hypertension Stage 1"
  } else if (bpr.systolic >= 120) {
    return BloodPressureCategoryEnumValues.ELEVATED // "Elevated"
  } else if (bpr.systolic >= 90) {
    return BloodPressureCategoryEnumValues.NORMAL // "Normal"
  } else {
    return BloodPressureCategoryEnumValues.LOW // "Low"
  }
}
