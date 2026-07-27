import { cn } from "@/utils/ui-utils"
import { TextInput, View } from "react-native"

const Input = ({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string
  onChange: (text: string) => void
  placeholder?: string
  className?: string
}) => {
  return (
    <View>
      <TextInput
        className={cn("rounded border p-2", className)}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
      />
    </View>
  )
}

export { Input }
