import { shallowMount, mount } from '@vue/test-utils'
import MyReport from '@/views/MyReport.vue'

describe('HelloWorld.vue', () => {
    test('is a Vue instance', () => {
        const wrapper = mount(MyReport)
        expect(wrapper.isVueInstance()).toBeTruthy()
    })
})
