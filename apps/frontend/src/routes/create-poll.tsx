import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from "@tanstack/react-form-start"
import { XIcon } from "lucide-react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Input } from '@/components/ui/input'
import { useSocketState } from '@/store/socketState'
import { Spinner } from '@/components/ui/spinner'
import { usePollState } from '@/store/pollState'

export const Route = createFileRoute('/create-poll')({ component: CreateComponent })

const formSchema = z.object({
  question: z.string().max(100),
  options: z
    .array(
      z.object({
        title: z.string().max(20),
      })
    )
    .min(2, "Add at least two options.")
    .max(5, "You can add up to 5 options."),
})

function CreateComponent() {
  
  const socket = useSocketState((state) => state.socket);
  useEffect(() => {
    if (socket){
      socket.close();
    }
  }, []);

  const connect = useSocketState((state) => state.connect);
  const createPoll = usePollState((state) => state.createPoll);

  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      question: "",
      options: [{ title: "" }],
    },
    validators: {
      onBlur: formSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      await connect();
      console.log("inside onsubmit")
      createPoll(value.question, value.options, (adminToken: string) => {
        setLoading(false);
        navigate({to: '/manage/$adminToken', params: {adminToken}})
      })
    }
  })
  

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <Card className="w-full sm:max-w-md">
      <CardHeader className="border-b">
        <CardTitle>Create Poll</CardTitle>
        <CardDescription>Enter details about your poll</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="form-tanstack-array"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
            <form.Field name='question'>
                {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                        <FieldSet className='gap-4 mb-4'>
                        <FieldLegend variant="label">Poll Question</FieldLegend>
                        <FieldDescription>
                            Enter your poll question
                        </FieldDescription>    
                         <Field
                              orientation="horizontal"
                              data-invalid={isInvalid}
                            >
                            <FieldContent>
                            <Input
                            id="form-tanstack-input-username"
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Enter question"
                            autoComplete="username"
                            />
                            </FieldContent>
                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field> 
                        </FieldSet>

                    )
                }}
            </form.Field>

          <form.Field name="options" mode="array">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <FieldSet className="gap-4">
                  <FieldLegend variant="label">Poll Options</FieldLegend>
                  <FieldDescription>
                    Add up to 5 options for your poll
                  </FieldDescription>
                  <FieldGroup className="gap-4">
                    {field.state.value.map((_, index) => (
                      <form.Field
                        key={index}
                        name={`options[${index}].title`}
                        children={(subField) => {
                          const isSubFieldInvalid =
                            subField.state.meta.isTouched &&
                            !subField.state.meta.isValid
                          return (
                            <Field
                              orientation="horizontal"
                              data-invalid={isSubFieldInvalid}
                            >
                              <FieldContent>
                                <InputGroup>
                                  <InputGroupInput
                                    id={`form-tanstack-array-options-${index}`}
                                    name={subField.name}
                                    value={subField.state.value}
                                    onBlur={subField.handleBlur}
                                    onChange={(e) =>
                                      subField.handleChange(e.target.value)
                                    }
                                    aria-invalid={isSubFieldInvalid}
                                    placeholder="Enter an Option"
                                    type="text"
                                  />
                                  {field.state.value.length > 1 && (
                                    <InputGroupAddon align="inline-end">
                                      <InputGroupButton
                                        type="button"
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => field.removeValue(index)}
                                        aria-label={`Remove option ${index + 1}`}
                                      >
                                        <XIcon />
                                      </InputGroupButton>
                                    </InputGroupAddon>
                                  )}
                                </InputGroup>
                                {isSubFieldInvalid && (
                                  <FieldError
                                    errors={subField.state.meta.errors}
                                  />
                                )}
                              </FieldContent>
                            </Field>
                          )
                        }}
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => field.pushValue({ title: "" })}
                      disabled={field.state.value.length >= 5}
                    >
                      Add an Option
                    </Button>
                  </FieldGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              )
            }}
          </form.Field>
        </form>
      </CardContent>
      <CardFooter className="border-t">
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-tanstack-array">
            {loading && <Spinner data-icon="inline-start"/>}Create
          </Button>
        </Field>
      </CardFooter>
    </Card>
    </div>
  )
}